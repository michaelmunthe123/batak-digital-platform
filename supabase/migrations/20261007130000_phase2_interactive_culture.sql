-- Phase 2: Content Expansion & Interactive Culture
-- Adds source-aware map points, adat timelines, dictionary entries,
-- rights-aware media metadata, improved search, and completeness dashboard.

create table if not exists public.entity_sources (
  entity_id uuid not null references public.entities(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  note text,
  primary key (entity_id, source_id)
);

create table if not exists public.map_locations (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  precision text not null default 'representative' check (precision in ('representative','place','approximate')),
  note text not null,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.map_location_sources (
  map_location_id uuid not null references public.map_locations(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  note text,
  primary key (map_location_id, source_id)
);

create table if not exists public.tradition_timeline_steps (
  id uuid primary key default gen_random_uuid(),
  tradition_entity_id uuid not null references public.traditions(entity_id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  description text not null,
  step_type text not null default 'context' check (step_type in ('context','preparation','core','closing','variation')),
  variation_note text,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tradition_entity_id, position)
);

create table if not exists public.timeline_step_sources (
  timeline_step_id uuid not null references public.tradition_timeline_steps(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  note text,
  primary key (timeline_step_id, source_id)
);

create table if not exists public.dictionary_entries (
  id uuid primary key default gen_random_uuid(),
  language_entity_id uuid not null references public.language_varieties(entity_id) on delete cascade,
  headword text not null,
  definition_id text not null,
  part_of_speech text,
  pronunciation text,
  usage_note text,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(language_entity_id, headword, definition_id)
);

create table if not exists public.dictionary_entry_sources (
  dictionary_entry_id uuid not null references public.dictionary_entries(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  note text,
  primary key (dictionary_entry_id, source_id)
);

alter table public.media_assets alter column storage_path drop not null;
alter table public.media_assets add column if not exists title text;
alter table public.media_assets add column if not exists media_type text not null default 'image' check (media_type in ('image','audio','document','video'));
alter table public.media_assets add column if not exists external_url text;
alter table public.media_assets add column if not exists creator text;
alter table public.media_assets add column if not exists license_url text;
alter table public.media_assets add column if not exists attribution_text text;
alter table public.media_assets add column if not exists rights_status text not null default 'unknown' check (rights_status in ('cleared','public_domain','licensed','metadata_only','unknown'));
alter table public.media_assets add column if not exists usage_note text;
alter table public.media_assets add column if not exists sort_order integer not null default 0;

create index if not exists map_locations_entity_idx on public.map_locations(entity_id);
create index if not exists timeline_steps_tradition_idx on public.tradition_timeline_steps(tradition_entity_id, position);
create index if not exists dictionary_entries_headword_trgm_idx on public.dictionary_entries using gin (headword gin_trgm_ops);
create index if not exists dictionary_entries_definition_trgm_idx on public.dictionary_entries using gin (definition_id gin_trgm_ops);

create or replace function public.search_knowledge_v2(
  search_query text,
  type_filters text[] default null,
  source_backed_only boolean default false
)
returns table (
  slug text,
  title text,
  type text,
  summary text,
  score real
)
language sql
stable
as $$
  select
    e.slug,
    e.title,
    e.type,
    coalesce(e.summary, '') as summary,
    (
      case when length(trim(search_query)) = 0 then 1 else
        ts_rank(
          to_tsvector(
            'simple',
            coalesce(e.title, '') || ' ' || coalesce(e.summary, '') || ' ' ||
            coalesce((select string_agg(a.alias, ' ') from public.entity_aliases a where a.entity_id = e.id), '') || ' ' ||
            coalesce((select string_agg(cs.heading || ' ' || cs.body, ' ') from public.content_sections cs where cs.entity_id = e.id and cs.status = 'published'), '')
          ),
          websearch_to_tsquery('simple', case when length(trim(search_query)) = 0 then e.title else search_query end)
        )
        + greatest(similarity(e.title, search_query), similarity(e.slug, search_query))
      end
    )::real as score
  from public.entities e
  where e.status = 'published'
    and (type_filters is null or e.type = any(type_filters))
    and (
      not source_backed_only
      or exists (select 1 from public.entity_sources es where es.entity_id = e.id)
      or exists (
        select 1 from public.claims c
        join public.claim_sources cs on cs.claim_id = c.id
        where c.entity_id = e.id and c.status <> 'draft'
      )
    )
    and (
      length(trim(search_query)) = 0
      or to_tsvector(
          'simple',
          coalesce(e.title, '') || ' ' || coalesce(e.summary, '') || ' ' ||
          coalesce((select string_agg(a.alias, ' ') from public.entity_aliases a where a.entity_id = e.id), '') || ' ' ||
          coalesce((select string_agg(cs.heading || ' ' || cs.body, ' ') from public.content_sections cs where cs.entity_id = e.id and cs.status = 'published'), '')
        ) @@ websearch_to_tsquery('simple', search_query)
      or e.title % search_query
      or e.slug % search_query
      or exists (select 1 from public.entity_aliases a where a.entity_id = e.id and a.alias % search_query)
    )
  order by score desc, e.title asc
  limit 100;
$$;

grant execute on function public.search_knowledge_v2(text, text[], boolean) to anon, authenticated;

create or replace view public.content_completeness as
with base as (
  select
    e.id,
    e.slug as entity_slug,
    e.title,
    e.type,
    (length(trim(coalesce(e.summary, ''))) >= 40) as has_summary,
    exists(select 1 from public.content_sections cs where cs.entity_id=e.id and cs.status='published') as has_sections,
    (
      exists(select 1 from public.entity_sources es where es.entity_id=e.id)
      or exists(select 1 from public.claims c join public.claim_sources csrc on csrc.claim_id=c.id where c.entity_id=e.id and c.status <> 'draft')
    ) as has_sources,
    exists(select 1 from public.relationships r where (r.source_entity_id=e.id or r.target_entity_id=e.id) and r.status <> 'draft') as has_relationships,
    exists(select 1 from public.media_assets m where m.entity_id=e.id and m.status='published') as has_media,
    case
      when e.type in ('cultural_group','region') then exists(select 1 from public.map_locations ml where ml.entity_id=e.id and ml.status='published')
      when e.type='tradition' then exists(select 1 from public.tradition_timeline_steps ts where ts.tradition_entity_id=e.id and ts.status='published')
      when e.type='language_variety' then exists(select 1 from public.dictionary_entries de where de.language_entity_id=e.id and de.status='published')
      else false
    end as has_interactive_data
  from public.entities e
  where e.status='published'
)
select
  entity_slug,
  title,
  type,
  round(((has_summary::int + has_sections::int + has_sources::int + has_relationships::int + has_media::int + has_interactive_data::int)::numeric / 6) * 100)::int as score,
  has_summary,
  has_sections,
  has_sources,
  has_relationships,
  has_media,
  has_interactive_data,
  array_remove(array[
    case when not has_summary then 'ringkasan memadai' end,
    case when not has_sections then 'content section' end,
    case when not has_sources then 'sumber' end,
    case when not has_relationships then 'related content' end,
    case when not has_media then 'media + rights metadata' end,
    case when not has_interactive_data then 'data interaktif sesuai tipe' end
  ], null) as missing
from base;

grant select on public.content_completeness to authenticated;

alter table public.entity_sources enable row level security;
alter table public.map_locations enable row level security;
alter table public.map_location_sources enable row level security;
alter table public.tradition_timeline_steps enable row level security;
alter table public.timeline_step_sources enable row level security;
alter table public.dictionary_entries enable row level security;
alter table public.dictionary_entry_sources enable row level security;

create policy "entity_sources_public_read" on public.entity_sources for select using (
  exists(select 1 from public.entities e where e.id=entity_id and (e.status='published' or public.is_editorial()))
);
create policy "entity_sources_editor_write" on public.entity_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "map_locations_public_read" on public.map_locations for select using (
  (status='published' and exists(select 1 from public.entities e where e.id=entity_id and e.status='published')) or public.is_editorial()
);
create policy "map_locations_editor_write" on public.map_locations for all using (public.can_edit()) with check (public.can_edit());
create policy "map_location_sources_public_read" on public.map_location_sources for select using (
  exists(select 1 from public.map_locations ml where ml.id=map_location_id and (ml.status='published' or public.is_editorial()))
);
create policy "map_location_sources_editor_write" on public.map_location_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "timeline_steps_public_read" on public.tradition_timeline_steps for select using (
  (status='published' and exists(select 1 from public.entities e where e.id=tradition_entity_id and e.status='published')) or public.is_editorial()
);
create policy "timeline_steps_editor_write" on public.tradition_timeline_steps for all using (public.can_edit()) with check (public.can_edit());
create policy "timeline_sources_public_read" on public.timeline_step_sources for select using (
  exists(select 1 from public.tradition_timeline_steps ts where ts.id=timeline_step_id and (ts.status='published' or public.is_editorial()))
);
create policy "timeline_sources_editor_write" on public.timeline_step_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "dictionary_entries_public_read" on public.dictionary_entries for select using (
  (status='published' and exists(select 1 from public.entities e where e.id=language_entity_id and e.status='published')) or public.is_editorial()
);
create policy "dictionary_entries_editor_write" on public.dictionary_entries for all using (public.can_edit()) with check (public.can_edit());
create policy "dictionary_sources_public_read" on public.dictionary_entry_sources for select using (
  exists(select 1 from public.dictionary_entries de where de.id=dictionary_entry_id and (de.status='published' or public.is_editorial()))
);
create policy "dictionary_sources_editor_write" on public.dictionary_entry_sources for all using (public.can_edit()) with check (public.can_edit());
