create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$ begin
  create type public.content_status as enum ('draft', 'in_review', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.editorial_role as enum ('admin', 'editor', 'reviewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.claim_status as enum (
    'verified',
    'supported',
    'regional_variation',
    'disputed',
    'community_sourced',
    'draft'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.source_level as enum ('A', 'B', 'C', 'D');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.editorial_role,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  type text not null check (
    type in (
      'cultural_group','clan','region','tradition','kinship_system',
      'kinship_term','language_variety','artifact','performance',
      'textile','architecture','cuisine'
    )
  ),
  title text not null,
  summary text,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entity_aliases (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  alias text not null,
  locale text default 'id',
  note text,
  unique(entity_id, alias)
);

create table if not exists public.cultural_groups (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  preferred_label text,
  classification_note text
);

create table if not exists public.clans (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  local_term text,
  editorial_scope_note text
);

create table if not exists public.regions (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  region_type text,
  parent_region_id uuid references public.entities(id)
);

create table if not exists public.traditions (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  tradition_type text,
  context_note text
);

create table if not exists public.kinship_systems (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  context_note text
);

create table if not exists public.kinship_terms (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  term text,
  usage_note text
);

create table if not exists public.language_varieties (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  glottocode text,
  iso_code text,
  classification_note text
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  creator text,
  publisher text,
  year integer,
  url text,
  type text not null check (type in ('academic','institutional','oral_history','community','archive')),
  level public.source_level not null,
  citation_text text,
  description text not null default '',
  access_date date,
  status public.content_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  claim_key text,
  body text not null,
  status public.claim_status not null default 'draft',
  region_id uuid references public.entities(id),
  context_note text,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claim_sources (
  claim_id uuid not null references public.claims(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  support_type text not null default 'supports' check (support_type in ('supports','contradicts','context')),
  note text,
  primary key (claim_id, source_id)
);

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid not null references public.entities(id) on delete cascade,
  target_entity_id uuid not null references public.entities(id) on delete cascade,
  relationship_type text not null,
  status public.claim_status not null default 'draft',
  direction_note text,
  context_note text,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_entity_id <> target_entity_id)
);

create table if not exists public.relationship_sources (
  relationship_id uuid not null references public.relationships(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  support_type text not null default 'supports' check (support_type in ('supports','contradicts','context')),
  note text,
  primary key (relationship_id, source_id)
);

create table if not exists public.classification_schemes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  authority text,
  description text,
  source_id uuid references public.sources(id),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.classification_memberships (
  scheme_id uuid not null references public.classification_schemes(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  parent_entity_id uuid references public.entities(id),
  label_in_scheme text,
  note text,
  primary key (scheme_id, entity_id)
);

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  heading text not null,
  body text not null,
  position integer not null default 0,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references public.entities(id) on delete set null,
  storage_path text not null,
  alt_text text not null,
  caption text,
  rights_holder text,
  license text,
  source_id uuid references public.sources(id),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id uuid not null,
  snapshot jsonb not null,
  changed_by uuid references auth.users(id),
  change_note text,
  created_at timestamptz not null default now()
);

create index if not exists entities_title_trgm_idx
  on public.entities using gin (title gin_trgm_ops);
create index if not exists entities_slug_trgm_idx
  on public.entities using gin (slug gin_trgm_ops);
create index if not exists entities_search_idx
  on public.entities using gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, ''))
  );
create index if not exists claims_entity_idx on public.claims(entity_id);
create index if not exists relationships_source_idx on public.relationships(source_entity_id);
create index if not exists relationships_target_idx on public.relationships(target_entity_id);
create index if not exists sections_entity_idx on public.content_sections(entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entities_updated_at on public.entities;
create trigger entities_updated_at
before update on public.entities
for each row execute function public.set_updated_at();

drop trigger if exists sources_updated_at on public.sources;
create trigger sources_updated_at
before update on public.sources
for each row execute function public.set_updated_at();

drop trigger if exists claims_updated_at on public.claims;
create trigger claims_updated_at
before update on public.claims
for each row execute function public.set_updated_at();

drop trigger if exists relationships_updated_at on public.relationships;
create trigger relationships_updated_at
before update on public.relationships
for each row execute function public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_editorial()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin','editor','reviewer')
  );
$$;

create or replace function public.can_edit()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin','editor')
  );
$$;

create or replace function public.search_knowledge(search_query text)
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
      ts_rank(
        to_tsvector('simple', coalesce(e.title, '') || ' ' || coalesce(e.summary, '')),
        websearch_to_tsquery('simple', search_query)
      )
      + greatest(similarity(e.title, search_query), similarity(e.slug, search_query))
    )::real as score
  from public.entities e
  where e.status = 'published'
    and length(trim(search_query)) > 0
    and (
      to_tsvector('simple', coalesce(e.title, '') || ' ' || coalesce(e.summary, ''))
        @@ websearch_to_tsquery('simple', search_query)
      or e.title % search_query
      or e.slug % search_query
      or exists (
        select 1
        from public.entity_aliases a
        where a.entity_id = e.id and a.alias % search_query
      )
    )
  order by score desc, e.title asc
  limit 50;
$$;

grant execute on function public.search_knowledge(text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.entities enable row level security;
alter table public.entity_aliases enable row level security;
alter table public.cultural_groups enable row level security;
alter table public.clans enable row level security;
alter table public.regions enable row level security;
alter table public.traditions enable row level security;
alter table public.kinship_systems enable row level security;
alter table public.kinship_terms enable row level security;
alter table public.language_varieties enable row level security;
alter table public.sources enable row level security;
alter table public.claims enable row level security;
alter table public.claim_sources enable row level security;
alter table public.relationships enable row level security;
alter table public.relationship_sources enable row level security;
alter table public.classification_schemes enable row level security;
alter table public.classification_memberships enable row level security;
alter table public.content_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.revisions enable row level security;

create policy "profiles_select_self_or_editorial"
on public.profiles for select
using (id = auth.uid() or public.is_editorial());

create policy "entities_public_read"
on public.entities for select
using (status = 'published' or public.is_editorial());

create policy "entities_editor_write"
on public.entities for all
using (public.can_edit())
with check (public.can_edit());

create policy "aliases_public_read"
on public.entity_aliases for select
using (
  exists (
    select 1 from public.entities e
    where e.id = entity_id and (e.status = 'published' or public.is_editorial())
  )
);

create policy "aliases_editor_write"
on public.entity_aliases for all
using (public.can_edit())
with check (public.can_edit());

create policy "sources_public_read"
on public.sources for select
using (status = 'published' or public.is_editorial());

create policy "sources_editor_write"
on public.sources for all
using (public.can_edit())
with check (public.can_edit());

create policy "claims_public_read"
on public.claims for select
using (
  public.is_editorial()
  or (
    status <> 'draft'
    and exists (
      select 1 from public.entities e
      where e.id = entity_id and e.status = 'published'
    )
  )
);

create policy "claims_editor_write"
on public.claims for all
using (public.can_edit())
with check (public.can_edit());

create policy "claim_sources_public_read"
on public.claim_sources for select
using (
  public.is_editorial()
  or exists (
    select 1 from public.claims c
    join public.entities e on e.id = c.entity_id
    where c.id = claim_id and c.status <> 'draft' and e.status = 'published'
  )
);

create policy "claim_sources_editor_write"
on public.claim_sources for all
using (public.can_edit())
with check (public.can_edit());

create policy "relationships_public_read"
on public.relationships for select
using (
  public.is_editorial()
  or (
    status <> 'draft'
    and exists (
      select 1 from public.entities e
      where e.id = source_entity_id and e.status = 'published'
    )
    and exists (
      select 1 from public.entities e
      where e.id = target_entity_id and e.status = 'published'
    )
  )
);

create policy "relationships_editor_write"
on public.relationships for all
using (public.can_edit())
with check (public.can_edit());

create policy "relationship_sources_public_read"
on public.relationship_sources for select
using (
  public.is_editorial()
  or exists (
    select 1 from public.relationships r
    where r.id = relationship_id and r.status <> 'draft'
  )
);

create policy "relationship_sources_editor_write"
on public.relationship_sources for all
using (public.can_edit())
with check (public.can_edit());

-- Subtype/read policies share a single rule: parent entity must be public or viewer editorial.
create policy "cultural_groups_read" on public.cultural_groups for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "clans_read" on public.clans for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "regions_read" on public.regions for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "traditions_read" on public.traditions for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "kinship_systems_read" on public.kinship_systems for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "kinship_terms_read" on public.kinship_terms for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));
create policy "language_varieties_read" on public.language_varieties for select
using (exists (select 1 from public.entities e where e.id = entity_id and (e.status='published' or public.is_editorial())));

create policy "subtypes_editor_write_cultural_groups" on public.cultural_groups for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_clans" on public.clans for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_regions" on public.regions for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_traditions" on public.traditions for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_kinship_systems" on public.kinship_systems for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_kinship_terms" on public.kinship_terms for all using (public.can_edit()) with check (public.can_edit());
create policy "subtypes_editor_write_language_varieties" on public.language_varieties for all using (public.can_edit()) with check (public.can_edit());

create policy "classification_schemes_read" on public.classification_schemes for select
using (status='published' or public.is_editorial());
create policy "classification_schemes_write" on public.classification_schemes for all
using (public.can_edit()) with check (public.can_edit());

create policy "classification_memberships_read" on public.classification_memberships for select
using (
  exists (
    select 1 from public.classification_schemes s
    where s.id = scheme_id and (s.status='published' or public.is_editorial())
  )
);
create policy "classification_memberships_write" on public.classification_memberships for all
using (public.can_edit()) with check (public.can_edit());

create policy "sections_public_read" on public.content_sections for select
using (
  status='published'
  and exists (select 1 from public.entities e where e.id=entity_id and e.status='published')
  or public.is_editorial()
);
create policy "sections_editor_write" on public.content_sections for all
using (public.can_edit()) with check (public.can_edit());

create policy "media_public_read" on public.media_assets for select
using (status='published' or public.is_editorial());
create policy "media_editor_write" on public.media_assets for all
using (public.can_edit()) with check (public.can_edit());

create policy "revisions_editorial_read" on public.revisions for select
using (public.is_editorial());
create policy "revisions_editorial_write" on public.revisions for insert
with check (public.is_editorial());
