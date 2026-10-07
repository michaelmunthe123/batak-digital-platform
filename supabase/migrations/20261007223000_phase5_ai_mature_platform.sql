-- Phase 5: AI & Mature Platform
-- Adds source-grounded RAG documents, hybrid search, AI audit/feedback,
-- privacy-preserving rate limiting, and editorial AI review records.
-- Public AI never writes to cultural knowledge tables directly.

create schema if not exists extensions;
create extension if not exists vector with schema extensions;

create table if not exists public.ai_documents (
  id uuid primary key default gen_random_uuid(),
  document_key text not null unique,
  document_type text not null check (document_type in (
    'entity_summary','content_section','claim','relationship',
    'timeline_step','dictionary_entry','kinship_rule'
  )),
  title text not null,
  content text not null,
  entity_id uuid references public.entities(id) on delete cascade,
  entity_slug text,
  entity_type text,
  source_id uuid not null references public.sources(id) on delete cascade,
  citation_locator text,
  claim_status public.claim_status,
  cultural_context text,
  content_hash text not null,
  embedding extensions.vector(512),
  embedding_model text,
  status public.content_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''))
  ) stored
);

create index if not exists ai_documents_search_idx
  on public.ai_documents using gin (search_vector);
create index if not exists ai_documents_entity_idx
  on public.ai_documents(entity_id);
create index if not exists ai_documents_source_idx
  on public.ai_documents(source_id);
create index if not exists ai_documents_status_idx
  on public.ai_documents(status, document_type);
create index if not exists ai_documents_embedding_hnsw_idx
  on public.ai_documents using hnsw (embedding extensions.vector_cosine_ops)
  where embedding is not null and status='published';

create table if not exists public.ai_request_log (
  id uuid primary key default gen_random_uuid(),
  request_kind text not null check (request_kind in (
    'assistant','semantic_search','learning_plan','editorial_review'
  )),
  actor_id uuid references auth.users(id) on delete set null,
  anonymous_key_hash text,
  prompt_text text,
  prompt_hash text not null,
  model text,
  embedding_model text,
  answer_text text,
  retrieved_document_ids uuid[] not null default '{}'::uuid[],
  grounded_status text not null default 'insufficient' check (
    grounded_status in ('grounded','partial','insufficient','blocked','error')
  ),
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  latency_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_request_log_kind_created_idx
  on public.ai_request_log(request_kind, created_at desc);
create index if not exists ai_request_log_actor_idx
  on public.ai_request_log(actor_id, created_at desc);

create table if not exists public.ai_feedback (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ai_request_log(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  rating smallint not null check (rating in (-1, 1)),
  reason text check (reason is null or reason in (
    'helpful','incorrect','missing_source','unclear','cultural_sensitivity','other'
  )),
  comment text,
  created_at timestamptz not null default now(),
  unique(request_id, actor_id)
);

create table if not exists public.ai_editorial_reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.ai_request_log(id) on delete set null,
  target_type text,
  target_id uuid,
  input_snapshot_hash text not null,
  input_excerpt text,
  retrieved_document_ids uuid[] not null default '{}'::uuid[],
  output jsonb not null,
  model text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists ai_editorial_reviews_creator_idx
  on public.ai_editorial_reviews(created_by, created_at desc);

create table if not exists private.ai_rate_windows (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Public knowledge rows eligible for AI indexing. Every row has a published source.
create or replace view public.ai_index_source_rows
with (security_invoker = true)
as
  select
    'entity:' || e.id::text || ':' || es.source_id::text as document_key,
    'entity_summary'::text as document_type,
    e.title,
    coalesce(e.summary,'') as content,
    e.id as entity_id,
    e.slug as entity_slug,
    e.type as entity_type,
    es.source_id,
    es.locator as citation_locator,
    null::public.claim_status as claim_status,
    null::text as cultural_context,
    jsonb_build_object('entity_type', e.type) as metadata
  from public.entities e
  join public.entity_sources es on es.entity_id=e.id
  join public.sources s on s.id=es.source_id
  where e.status='published' and s.status='published' and length(trim(coalesce(e.summary,''))) > 0

  union all

  select
    'section:' || cs.id::text || ':' || es.source_id::text,
    'content_section',
    e.title || ' — ' || cs.heading,
    cs.body,
    e.id,
    e.slug,
    e.type,
    es.source_id,
    es.locator,
    null::public.claim_status,
    null::text,
    jsonb_build_object('entity_type', e.type, 'section_heading', cs.heading)
  from public.content_sections cs
  join public.entities e on e.id=cs.entity_id
  join public.entity_sources es on es.entity_id=e.id
  join public.sources s on s.id=es.source_id
  where cs.status='published' and e.status='published' and s.status='published'

  union all

  select
    'claim:' || c.id::text || ':' || cs.source_id::text,
    'claim',
    e.title || ' — klaim',
    c.body || case when c.context_note is not null then E'\nKonteks: ' || c.context_note else '' end,
    e.id,
    e.slug,
    e.type,
    cs.source_id,
    cs.locator,
    c.status,
    null::text,
    jsonb_build_object('support_type', cs.support_type, 'claim_key', c.claim_key)
  from public.claims c
  join public.entities e on e.id=c.entity_id
  join public.claim_sources cs on cs.claim_id=c.id
  join public.sources s on s.id=cs.source_id
  where e.status='published' and s.status='published' and c.status <> 'draft'

  union all

  select
    'relationship:' || r.id::text || ':' || rs.source_id::text,
    'relationship',
    se.title || ' ↔ ' || te.title,
    se.title || ' — ' || r.relationship_type || ' — ' || te.title ||
      case when r.context_note is not null then E'\nKonteks: ' || r.context_note else '' end,
    se.id,
    se.slug,
    se.type,
    rs.source_id,
    rs.locator,
    r.status,
    null::text,
    jsonb_build_object('target_slug', te.slug, 'relationship_type', r.relationship_type, 'support_type', rs.support_type)
  from public.relationships r
  join public.entities se on se.id=r.source_entity_id
  join public.entities te on te.id=r.target_entity_id
  join public.relationship_sources rs on rs.relationship_id=r.id
  join public.sources s on s.id=rs.source_id
  where se.status='published' and te.status='published' and s.status='published' and r.status <> 'draft'

  union all

  select
    'timeline:' || ts.id::text || ':' || tss.source_id::text,
    'timeline_step',
    e.title || ' — ' || ts.title,
    ts.description || case when ts.variation_note is not null then E'\nVariasi: ' || ts.variation_note else '' end,
    e.id,
    e.slug,
    e.type,
    tss.source_id,
    tss.locator,
    null::public.claim_status,
    null::text,
    jsonb_build_object('position', ts.position, 'step_type', ts.step_type)
  from public.tradition_timeline_steps ts
  join public.entities e on e.id=ts.tradition_entity_id
  join public.timeline_step_sources tss on tss.timeline_step_id=ts.id
  join public.sources s on s.id=tss.source_id
  where ts.status='published' and e.status='published' and s.status='published'

  union all

  select
    'dictionary:' || de.id::text || ':' || des.source_id::text,
    'dictionary_entry',
    e.title || ' — ' || de.headword,
    de.headword || ': ' || de.definition_id ||
      case when de.usage_note is not null then E'\nPenggunaan: ' || de.usage_note else '' end,
    e.id,
    e.slug,
    e.type,
    des.source_id,
    des.locator,
    null::public.claim_status,
    e.slug,
    jsonb_build_object('part_of_speech', de.part_of_speech, 'pronunciation', de.pronunciation)
  from public.dictionary_entries de
  join public.entities e on e.id=de.language_entity_id
  join public.dictionary_entry_sources des on des.dictionary_entry_id=de.id
  join public.sources s on s.id=des.source_id
  where de.status='published' and e.status='published' and s.status='published'

  union all

  select
    'kinship:' || kr.id::text || ':' || krs.source_id::text,
    'kinship_rule',
    kr.term || ' — ' || kr.cultural_context,
    kr.relation_label_id || ': ' || kr.term || E'\n' || kr.explanation ||
      case when kr.caution is not null then E'\nCatatan: ' || kr.caution else '' end,
    null::uuid,
    null::text,
    null::text,
    krs.source_id,
    krs.locator,
    kr.status,
    kr.cultural_context,
    jsonb_build_object('relation_code', kr.relation_code, 'support_type', krs.support_type)
  from public.kinship_rules kr
  join public.kinship_rule_sources krs on krs.rule_id=kr.id
  join public.sources s on s.id=krs.source_id
  where kr.publication_status='published' and kr.status <> 'draft' and s.status='published';

revoke all on public.ai_index_source_rows from anon, authenticated;
grant select on public.ai_index_source_rows to service_role;

-- Reciprocal-rank-fusion hybrid search over curated, source-backed AI documents.
create or replace function public.hybrid_search_ai(
  query_text text,
  query_embedding extensions.vector(512),
  match_count integer default 8,
  document_types text[] default null
)
returns table (
  id uuid,
  document_key text,
  document_type text,
  title text,
  content text,
  entity_id uuid,
  entity_slug text,
  entity_type text,
  source_id uuid,
  source_title text,
  source_url text,
  citation_locator text,
  claim_status public.claim_status,
  cultural_context text,
  score double precision
)
language sql
stable
security invoker
set search_path = ''
as $$
with full_text as (
  select d.id,
    row_number() over (
      order by ts_rank_cd(d.search_vector, plainto_tsquery('simple', query_text)) desc
    ) as rank
  from public.ai_documents d
  where d.status='published'
    and (document_types is null or d.document_type = any(document_types))
    and d.search_vector @@ plainto_tsquery('simple', query_text)
  order by ts_rank_cd(d.search_vector, plainto_tsquery('simple', query_text)) desc
  limit greatest(match_count * 4, 20)
), semantic as (
  select d.id,
    row_number() over (order by d.embedding <=> query_embedding) as rank
  from public.ai_documents d
  where d.status='published'
    and d.embedding is not null
    and (document_types is null or d.document_type = any(document_types))
  order by d.embedding <=> query_embedding
  limit greatest(match_count * 4, 20)
), fused as (
  select coalesce(f.id, s.id) as id,
    coalesce(1.0 / (60 + f.rank), 0.0) + coalesce(1.0 / (60 + s.rank), 0.0) as score
  from full_text f
  full outer join semantic s on s.id=f.id
)
select
  d.id,
  d.document_key,
  d.document_type,
  d.title,
  d.content,
  d.entity_id,
  d.entity_slug,
  d.entity_type,
  d.source_id,
  src.title as source_title,
  src.url as source_url,
  d.citation_locator,
  d.claim_status,
  d.cultural_context,
  fused.score
from fused
join public.ai_documents d on d.id=fused.id
join public.sources src on src.id=d.source_id and src.status='published'
order by fused.score desc
limit least(greatest(match_count,1),20);
$$;

revoke all on function public.hybrid_search_ai(text, extensions.vector, integer, text[]) from public, anon, authenticated;
grant execute on function public.hybrid_search_ai(text, extensions.vector, integer, text[]) to service_role;

create or replace function public.consume_ai_rate_limit(
  target_key_hash text,
  request_limit integer default 20,
  window_minutes integer default 10
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row private.ai_rate_windows%rowtype;
  now_ts timestamptz := now();
begin
  if target_key_hash is null or length(target_key_hash) < 16 then
    return false;
  end if;

  insert into private.ai_rate_windows(key_hash, window_started_at, request_count, updated_at)
  values (target_key_hash, now_ts, 1, now_ts)
  on conflict (key_hash) do nothing;

  select * into current_row
  from private.ai_rate_windows
  where key_hash=target_key_hash
  for update;

  if current_row.window_started_at < now_ts - make_interval(mins => window_minutes) then
    update private.ai_rate_windows
      set window_started_at=now_ts, request_count=1, updated_at=now_ts
      where key_hash=target_key_hash;
    return true;
  end if;

  if current_row.request_count >= request_limit then
    return false;
  end if;

  update private.ai_rate_windows
    set request_count=request_count+1, updated_at=now_ts
    where key_hash=target_key_hash;
  return true;
end;
$$;

revoke all on function public.consume_ai_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_rate_limit(text, integer, integer) to service_role;

alter table public.ai_documents enable row level security;
alter table public.ai_request_log enable row level security;
alter table public.ai_feedback enable row level security;
alter table public.ai_editorial_reviews enable row level security;

-- Editorial users can inspect AI data. Public visitors access AI only through server routes.
create policy "ai_documents_editorial_read" on public.ai_documents
  for select to authenticated using (public.is_editorial());
create policy "ai_documents_editorial_write" on public.ai_documents
  for all to authenticated using (public.can_edit()) with check (public.can_edit());

create policy "ai_request_log_editorial_read" on public.ai_request_log
  for select to authenticated using (public.is_editorial());

create policy "ai_feedback_editorial_read" on public.ai_feedback
  for select to authenticated using (public.is_editorial());

create policy "ai_editorial_reviews_own_or_editorial" on public.ai_editorial_reviews
  for select to authenticated using (created_by=auth.uid() or public.is_editorial());
create policy "ai_editorial_reviews_insert" on public.ai_editorial_reviews
  for insert to authenticated with check (created_by=auth.uid() and public.is_editorial());

create or replace view public.ai_system_status
with (security_invoker = true)
as
select
  (select count(*)::integer from public.ai_documents where status='published') as published_documents,
  (select count(*)::integer from public.ai_documents where status='published' and embedding is not null) as embedded_documents,
  (select count(*)::integer from public.ai_request_log where created_at > now() - interval '7 days') as requests_7d,
  (select count(*)::integer from public.ai_request_log where created_at > now() - interval '7 days' and grounded_status='error') as errors_7d,
  (select count(*)::integer from public.ai_feedback where created_at > now() - interval '30 days' and rating=1) as positive_feedback_30d,
  (select count(*)::integer from public.ai_feedback where created_at > now() - interval '30 days' and rating=-1) as negative_feedback_30d;

grant select on public.ai_system_status to authenticated;

-- Keep document timestamps current.
drop trigger if exists ai_documents_updated_at on public.ai_documents;
create trigger ai_documents_updated_at
before update on public.ai_documents
for each row execute function public.set_updated_at();
