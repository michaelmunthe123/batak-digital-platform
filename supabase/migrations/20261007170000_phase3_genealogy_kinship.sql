-- Phase 3: genealogy, tarombo, kinship rules, privacy, and source-aware inference.

create table if not exists public.genealogy_datasets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  title text not null,
  description text not null default '',
  cultural_context text,
  visibility text not null default 'restricted' check (visibility in ('public','restricted','private')),
  methodology_note text not null default '',
  is_demo boolean not null default false,
  owner_id uuid references auth.users(id) on delete set null,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.genealogy_dataset_sources (
  dataset_id uuid not null references public.genealogy_datasets(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  note text,
  primary key (dataset_id, source_id)
);

create table if not exists public.genealogy_nodes (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.genealogy_datasets(id) on delete cascade,
  label text not null,
  generation integer not null default 0,
  clan_entity_id uuid references public.entities(id) on delete set null,
  gender text not null default 'unknown' check (gender in ('male','female','unknown')),
  living_status text not null default 'unknown' check (living_status in ('unknown','living','deceased')),
  privacy_level text not null default 'restricted' check (privacy_level in ('public','restricted','private')),
  note text,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (living_status <> 'living' or privacy_level <> 'public')
);

create table if not exists public.genealogy_node_sources (
  node_id uuid not null references public.genealogy_nodes(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  support_type text not null default 'supports' check (support_type in ('supports','contradicts','context')),
  note text,
  primary key (node_id, source_id)
);

create table if not exists public.genealogy_edges (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.genealogy_datasets(id) on delete cascade,
  source_node_id uuid not null references public.genealogy_nodes(id) on delete cascade,
  target_node_id uuid not null references public.genealogy_nodes(id) on delete cascade,
  relation text not null check (relation in ('parent','spouse','sibling','adoptive_parent','traditional_descent')),
  status public.claim_status not null default 'draft',
  context_note text,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_node_id <> target_node_id)
);

create table if not exists public.genealogy_edge_sources (
  edge_id uuid not null references public.genealogy_edges(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  support_type text not null default 'supports' check (support_type in ('supports','contradicts','context')),
  note text,
  primary key (edge_id, source_id)
);

create table if not exists public.kinship_rules (
  id uuid primary key default gen_random_uuid(),
  cultural_context text not null,
  relation_code text not null,
  relation_label_id text not null,
  term text not null,
  explanation text not null,
  caution text,
  status public.claim_status not null default 'draft',
  publication_status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cultural_context, relation_code, term)
);

create table if not exists public.kinship_rule_sources (
  rule_id uuid not null references public.kinship_rules(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  locator text,
  support_type text not null default 'supports' check (support_type in ('supports','contradicts','context')),
  note text,
  primary key (rule_id, source_id)
);

create index if not exists genealogy_nodes_dataset_idx on public.genealogy_nodes(dataset_id, generation);
create index if not exists genealogy_edges_dataset_idx on public.genealogy_edges(dataset_id);
create index if not exists genealogy_edges_source_idx on public.genealogy_edges(source_node_id);
create index if not exists genealogy_edges_target_idx on public.genealogy_edges(target_node_id);
create index if not exists kinship_rules_lookup_idx on public.kinship_rules(cultural_context, relation_code);

-- Dataset consistency: both nodes of an edge must belong to the same dataset as the edge.
create or replace function public.validate_genealogy_edge_dataset()
returns trigger
language plpgsql
as $$
declare
  source_dataset uuid;
  target_dataset uuid;
begin
  select dataset_id into source_dataset from public.genealogy_nodes where id = new.source_node_id;
  select dataset_id into target_dataset from public.genealogy_nodes where id = new.target_node_id;
  if source_dataset is distinct from new.dataset_id or target_dataset is distinct from new.dataset_id then
    raise exception 'Genealogy edge nodes must belong to the edge dataset';
  end if;
  return new;
end;
$$;

drop trigger if exists genealogy_edge_dataset_guard on public.genealogy_edges;
create trigger genealogy_edge_dataset_guard
before insert or update on public.genealogy_edges
for each row execute function public.validate_genealogy_edge_dataset();

-- Public path helper: reads only published/public nodes and non-draft, non-disputed edges.
create or replace function public.find_public_genealogy_path(
  dataset_slug text,
  start_node uuid,
  end_node uuid,
  max_depth integer default 8
)
returns table(depth integer, node_id uuid, path_nodes uuid[], path_edges uuid[])
language sql
stable
security definer
set search_path = public
as $$
  with recursive allowed_dataset as (
    select id
    from public.genealogy_datasets
    where slug = dataset_slug and status = 'published' and visibility = 'public'
  ), walk(depth, node_id, path_nodes, path_edges) as (
    select 0, start_node, array[start_node]::uuid[], array[]::uuid[]
    where exists (
      select 1 from public.genealogy_nodes n
      join allowed_dataset d on d.id=n.dataset_id
      where n.id=start_node and n.status='published' and n.privacy_level='public'
    )
    union all
    select
      w.depth + 1,
      case when e.source_node_id=w.node_id then e.target_node_id else e.source_node_id end,
      w.path_nodes || case when e.source_node_id=w.node_id then e.target_node_id else e.source_node_id end,
      w.path_edges || e.id
    from walk w
    join public.genealogy_edges e
      on (e.source_node_id=w.node_id or e.target_node_id=w.node_id)
    join allowed_dataset d on d.id=e.dataset_id
    join public.genealogy_nodes next_node
      on next_node.id = case when e.source_node_id=w.node_id then e.target_node_id else e.source_node_id end
    where w.depth < greatest(1, least(max_depth, 12))
      and e.status not in ('draft','disputed')
      and next_node.status='published'
      and next_node.privacy_level='public'
      and not (next_node.id = any(w.path_nodes))
  )
  select depth,node_id,path_nodes,path_edges
  from walk
  where node_id=end_node
  order by depth
  limit 1;
$$;

grant execute on function public.find_public_genealogy_path(text, uuid, uuid, integer) to anon, authenticated;

-- Editorial summary for Phase 3 quality control.
create or replace view public.genealogy_dataset_completeness as
select
  d.id,
  d.slug,
  d.title,
  d.visibility,
  d.status,
  count(distinct n.id)::int as node_count,
  count(distinct e.id)::int as edge_count,
  count(distinct ds.source_id)::int as dataset_source_count,
  count(distinct es.source_id)::int as edge_source_count,
  count(distinct case when e.status='disputed' then e.id end)::int as disputed_edge_count,
  count(distinct case when n.living_status='living' then n.id end)::int as living_node_count
from public.genealogy_datasets d
left join public.genealogy_nodes n on n.dataset_id=d.id
left join public.genealogy_edges e on e.dataset_id=d.id
left join public.genealogy_dataset_sources ds on ds.dataset_id=d.id
left join public.genealogy_edge_sources es on es.edge_id=e.id
group by d.id,d.slug,d.title,d.visibility,d.status;

grant select on public.genealogy_dataset_completeness to authenticated;

alter table public.genealogy_datasets enable row level security;
alter table public.genealogy_dataset_sources enable row level security;
alter table public.genealogy_nodes enable row level security;
alter table public.genealogy_node_sources enable row level security;
alter table public.genealogy_edges enable row level security;
alter table public.genealogy_edge_sources enable row level security;
alter table public.kinship_rules enable row level security;
alter table public.kinship_rule_sources enable row level security;

create policy "genealogy_datasets_public_read" on public.genealogy_datasets for select using (
  (status='published' and visibility='public') or public.is_editorial() or owner_id=auth.uid()
);
create policy "genealogy_datasets_editor_write" on public.genealogy_datasets for all using (public.can_edit()) with check (public.can_edit());

create policy "genealogy_dataset_sources_read" on public.genealogy_dataset_sources for select using (
  exists(select 1 from public.genealogy_datasets d where d.id=dataset_id and ((d.status='published' and d.visibility='public') or public.is_editorial() or d.owner_id=auth.uid()))
);
create policy "genealogy_dataset_sources_editor_write" on public.genealogy_dataset_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "genealogy_nodes_public_read" on public.genealogy_nodes for select using (
  (status='published' and privacy_level='public' and exists(select 1 from public.genealogy_datasets d where d.id=dataset_id and d.status='published' and d.visibility='public'))
  or public.is_editorial()
  or exists(select 1 from public.genealogy_datasets d where d.id=dataset_id and d.owner_id=auth.uid())
);
create policy "genealogy_nodes_editor_write" on public.genealogy_nodes for all using (public.can_edit()) with check (public.can_edit());

create policy "genealogy_node_sources_read" on public.genealogy_node_sources for select using (
  exists(select 1 from public.genealogy_nodes n where n.id=node_id and (n.privacy_level='public' or public.is_editorial()))
);
create policy "genealogy_node_sources_editor_write" on public.genealogy_node_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "genealogy_edges_public_read" on public.genealogy_edges for select using (
  ((status <> 'draft') and exists(
    select 1
    from public.genealogy_datasets d
    join public.genealogy_nodes s on s.id=source_node_id
    join public.genealogy_nodes t on t.id=target_node_id
    where d.id=dataset_id and d.status='published' and d.visibility='public'
      and s.privacy_level='public' and s.status='published'
      and t.privacy_level='public' and t.status='published'
  )) or public.is_editorial()
);
create policy "genealogy_edges_editor_write" on public.genealogy_edges for all using (public.can_edit()) with check (public.can_edit());

create policy "genealogy_edge_sources_read" on public.genealogy_edge_sources for select using (
  exists(select 1 from public.genealogy_edges e where e.id=edge_id and (e.status <> 'draft' or public.is_editorial()))
);
create policy "genealogy_edge_sources_editor_write" on public.genealogy_edge_sources for all using (public.can_edit()) with check (public.can_edit());

create policy "kinship_rules_public_read" on public.kinship_rules for select using (
  (publication_status='published' and status <> 'draft') or public.is_editorial()
);
create policy "kinship_rules_editor_write" on public.kinship_rules for all using (public.can_edit()) with check (public.can_edit());
create policy "kinship_rule_sources_public_read" on public.kinship_rule_sources for select using (
  exists(select 1 from public.kinship_rules r where r.id=rule_id and ((r.publication_status='published' and r.status <> 'draft') or public.is_editorial()))
);
create policy "kinship_rule_sources_editor_write" on public.kinship_rule_sources for all using (public.can_edit()) with check (public.can_edit());

-- updated_at triggers
drop trigger if exists genealogy_datasets_updated_at on public.genealogy_datasets;
create trigger genealogy_datasets_updated_at before update on public.genealogy_datasets for each row execute function public.set_updated_at();
drop trigger if exists genealogy_nodes_updated_at on public.genealogy_nodes;
create trigger genealogy_nodes_updated_at before update on public.genealogy_nodes for each row execute function public.set_updated_at();
drop trigger if exists genealogy_edges_updated_at on public.genealogy_edges;
create trigger genealogy_edges_updated_at before update on public.genealogy_edges for each row execute function public.set_updated_at();
drop trigger if exists kinship_rules_updated_at on public.kinship_rules;
create trigger kinship_rules_updated_at before update on public.kinship_rules for each row execute function public.set_updated_at();

create or replace function public.transition_genealogy_dataset_status(
  target_id uuid,
  new_status public.content_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role public.editorial_role;
  snapshot jsonb;
begin
  select role into current_role from public.profiles where id=auth.uid();
  if current_role is null then raise exception 'Editorial role required'; end if;
  if current_role='editor' and new_status not in ('draft','in_review') then raise exception 'Editors can only move datasets to draft or in_review'; end if;
  if current_role='reviewer' and new_status not in ('draft','published') then raise exception 'Reviewers can only return to draft or publish'; end if;
  select to_jsonb(d) into snapshot from public.genealogy_datasets d where d.id=target_id;
  if snapshot is null then raise exception 'Genealogy dataset not found'; end if;
  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('genealogy_datasets',target_id,snapshot,auth.uid(),'status transition to '||new_status::text);
  update public.genealogy_datasets set status=new_status,updated_by=auth.uid() where id=target_id;
end;
$$;

create or replace function public.transition_genealogy_edge_status(
  target_id uuid,
  new_status public.claim_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role public.editorial_role;
  snapshot jsonb;
begin
  select role into current_role from public.profiles where id=auth.uid();
  if current_role is null then raise exception 'Editorial role required'; end if;
  if current_role='editor' and new_status <> 'draft' then raise exception 'Editors submit genealogy edges as draft'; end if;
  select to_jsonb(e) into snapshot from public.genealogy_edges e where e.id=target_id;
  if snapshot is null then raise exception 'Genealogy edge not found'; end if;
  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('genealogy_edges',target_id,snapshot,auth.uid(),'edge status transition to '||new_status::text);
  update public.genealogy_edges
  set status=new_status,reviewed_by=case when current_role in ('admin','reviewer') then auth.uid() else reviewed_by end
  where id=target_id;
end;
$$;

create or replace function public.transition_kinship_rule_status(
  target_id uuid,
  new_claim_status public.claim_status,
  new_publication_status public.content_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role public.editorial_role;
  snapshot jsonb;
begin
  select role into current_role from public.profiles where id=auth.uid();
  if current_role is null then raise exception 'Editorial role required'; end if;
  if current_role='editor' and (new_claim_status <> 'draft' or new_publication_status not in ('draft','in_review')) then
    raise exception 'Editors can only submit rules as draft/in_review';
  end if;
  if current_role='reviewer' and new_publication_status not in ('draft','published') then
    raise exception 'Reviewers can only return to draft or publish';
  end if;
  select to_jsonb(r) into snapshot from public.kinship_rules r where r.id=target_id;
  if snapshot is null then raise exception 'Kinship rule not found'; end if;
  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('kinship_rules',target_id,snapshot,auth.uid(),'rule transition');
  update public.kinship_rules
  set status=new_claim_status,
      publication_status=new_publication_status,
      reviewed_by=case when current_role in ('admin','reviewer') then auth.uid() else reviewed_by end
  where id=target_id;
end;
$$;

grant execute on function public.transition_genealogy_dataset_status(uuid, public.content_status) to authenticated;
grant execute on function public.transition_genealogy_edge_status(uuid, public.claim_status) to authenticated;
grant execute on function public.transition_kinship_rule_status(uuid, public.claim_status, public.content_status) to authenticated;
