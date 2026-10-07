create or replace function public.transition_entity_status(
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
  select role into current_role from public.profiles where id = auth.uid();

  if current_role is null then
    raise exception 'Editorial role required';
  end if;

  if current_role = 'editor' and new_status not in ('draft','in_review') then
    raise exception 'Editors can only move entities to draft or in_review';
  end if;

  if current_role = 'reviewer' and new_status not in ('draft','published') then
    raise exception 'Reviewers can only return to draft or publish';
  end if;

  select to_jsonb(e) into snapshot from public.entities e where e.id = target_id;
  if snapshot is null then raise exception 'Entity not found'; end if;

  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('entities',target_id,snapshot,auth.uid(),'status transition to ' || new_status::text);

  update public.entities
  set status = new_status, updated_by = auth.uid()
  where id = target_id;
end;
$$;

create or replace function public.transition_source_status(
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
  select role into current_role from public.profiles where id = auth.uid();

  if current_role is null then
    raise exception 'Editorial role required';
  end if;

  if current_role = 'editor' and new_status not in ('draft','in_review') then
    raise exception 'Editors can only move sources to draft or in_review';
  end if;

  if current_role = 'reviewer' and new_status not in ('draft','published') then
    raise exception 'Reviewers can only return to draft or publish';
  end if;

  select to_jsonb(s) into snapshot from public.sources s where s.id = target_id;
  if snapshot is null then raise exception 'Source not found'; end if;

  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('sources',target_id,snapshot,auth.uid(),'status transition to ' || new_status::text);

  update public.sources set status = new_status, updated_at = now() where id = target_id;
end;
$$;

create or replace function public.transition_claim_status(
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
  select role into current_role from public.profiles where id = auth.uid();

  if current_role is null then
    raise exception 'Editorial role required';
  end if;

  if current_role = 'editor' and new_status <> 'draft' then
    raise exception 'Editors submit claims as draft; reviewer/admin classifies them';
  end if;

  select to_jsonb(c) into snapshot from public.claims c where c.id = target_id;
  if snapshot is null then raise exception 'Claim not found'; end if;

  insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
  values ('claims',target_id,snapshot,auth.uid(),'claim status transition to ' || new_status::text);

  update public.claims
  set status = new_status,
      reviewed_by = case when current_role in ('admin','reviewer') then auth.uid() else reviewed_by end
  where id = target_id;
end;
$$;

grant execute on function public.transition_entity_status(uuid, public.content_status) to authenticated;
grant execute on function public.transition_source_status(uuid, public.content_status) to authenticated;
grant execute on function public.transition_claim_status(uuid, public.claim_status) to authenticated;
