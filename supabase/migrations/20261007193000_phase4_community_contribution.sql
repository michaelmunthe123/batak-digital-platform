-- Phase 4: invitation-based community contribution and moderation.
-- Contributors propose changes; they never mutate published knowledge tables directly.

create schema if not exists private;

DO $$ BEGIN
  CREATE TYPE public.community_membership_status AS ENUM ('invited','active','suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.contribution_type AS ENUM (
    'correction','source','new_content','relationship','genealogy','language','media'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.contribution_status AS ENUM (
    'draft','submitted','needs_evidence','in_review','accepted','merged','rejected','disputed','withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_report_status AS ENUM ('open','triaged','resolved','dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

create table if not exists public.community_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status public.community_membership_status not null default 'invited',
  invited_by uuid references auth.users(id) on delete set null,
  invited_at timestamptz not null default now(),
  activated_at timestamptz,
  suspended_at timestamptz,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contributor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null check (char_length(display_name) between 2 and 80),
  bio text not null default '' check (char_length(bio) <= 1000),
  interests text[] not null default '{}'::text[],
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  type public.contribution_type not null,
  target_entity_id uuid references public.entities(id) on delete set null,
  title text not null check (char_length(title) between 5 and 160),
  section_key text,
  rationale text not null check (char_length(rationale) between 10 and 5000),
  proposed_content text not null default '' check (char_length(proposed_content) <= 20000),
  status public.contribution_status not null default 'draft',
  moderator_id uuid references auth.users(id) on delete set null,
  moderation_note text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  merged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contribution_sources (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  proposed_title text,
  proposed_url text,
  locator text,
  note text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    source_id is not null
    or nullif(trim(coalesce(proposed_title,'')), '') is not null
    or nullif(trim(coalesce(proposed_url,'')), '') is not null
  )
);

create table if not exists public.contribution_messages (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  message_type text not null default 'comment' check (
    message_type in ('comment','evidence_request','response','decision')
  ),
  body text not null check (char_length(body) between 2 and 5000),
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contribution_audit_log (
  id bigint generated always as identity primary key,
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  from_status public.contribution_status,
  to_status public.contribution_status,
  detail jsonb not null default '{}'::jsonb,
  visible_to_author boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete set null,
  url_path text,
  category text not null check (
    category in ('incorrect','missing_source','cultural_sensitivity','privacy','copyright','other')
  ),
  description text not null check (char_length(description) between 10 and 5000),
  status public.content_report_status not null default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null default '',
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists community_memberships_status_idx on public.community_memberships(status);
create index if not exists contributor_profiles_slug_idx on public.contributor_profiles(slug);
create index if not exists contributions_author_idx on public.contributions(author_id, created_at desc);
create index if not exists contributions_status_idx on public.contributions(status, updated_at desc);
create index if not exists contributions_target_idx on public.contributions(target_entity_id);
create index if not exists contribution_sources_contribution_idx on public.contribution_sources(contribution_id);
create index if not exists contribution_messages_contribution_idx on public.contribution_messages(contribution_id, created_at);
create index if not exists contribution_audit_contribution_idx on public.contribution_audit_log(contribution_id, created_at);
create index if not exists content_reports_reporter_idx on public.content_reports(reporter_id, created_at desc);
create index if not exists content_reports_status_idx on public.content_reports(status, updated_at desc);
create index if not exists community_notifications_user_idx on public.community_notifications(user_id, read_at, created_at desc);

-- Keep timestamps consistent.
drop trigger if exists community_memberships_updated_at on public.community_memberships;
create trigger community_memberships_updated_at before update on public.community_memberships
for each row execute function public.set_updated_at();

drop trigger if exists contributor_profiles_updated_at on public.contributor_profiles;
create trigger contributor_profiles_updated_at before update on public.contributor_profiles
for each row execute function public.set_updated_at();

drop trigger if exists contributions_updated_at on public.contributions;
create trigger contributions_updated_at before update on public.contributions
for each row execute function public.set_updated_at();

drop trigger if exists content_reports_updated_at on public.content_reports;
create trigger content_reports_updated_at before update on public.content_reports
for each row execute function public.set_updated_at();

create or replace function public.is_active_contributor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.community_memberships m
    where m.user_id = (select auth.uid()) and m.status = 'active'
  );
$$;

create or replace function public.is_community_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('admin','editor','reviewer')
  );
$$;

create or replace function public.is_community_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

grant execute on function public.is_active_contributor() to authenticated;
grant execute on function public.is_community_moderator() to authenticated;
grant execute on function public.is_community_admin() to authenticated;

create or replace function public.activate_contributor_account(profile_slug text, profile_display_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  membership_status public.community_membership_status;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if profile_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid contributor slug'; end if;
  if char_length(profile_display_name) < 2 or char_length(profile_display_name) > 80 then
    raise exception 'Invalid display name';
  end if;

  select m.status into membership_status
  from public.community_memberships m where m.user_id = current_user_id;

  if membership_status is null then raise exception 'Contributor invitation required'; end if;
  if membership_status = 'suspended' then raise exception 'Contributor access suspended'; end if;

  update public.community_memberships
  set status = 'active', activated_at = coalesce(activated_at, now()), suspended_at = null
  where user_id = current_user_id;

  insert into public.contributor_profiles(user_id, slug, display_name)
  values (current_user_id, profile_slug, profile_display_name)
  on conflict (user_id) do update
    set slug = excluded.slug, display_name = excluded.display_name, updated_at = now();
end;
$$;

grant execute on function public.activate_contributor_account(text,text) to authenticated;

create or replace function public.transition_contribution_status(
  target_id uuid,
  new_status public.contribution_status,
  transition_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  current_row public.contributions%rowtype;
  editorial_role public.editorial_role;
  actor_is_moderator boolean := false;
  action_name text;
begin
  if actor is null then raise exception 'Authentication required'; end if;

  select * into current_row from public.contributions where id = target_id for update;
  if current_row.id is null then raise exception 'Contribution not found'; end if;

  select p.role into editorial_role from public.profiles p where p.id = actor;
  actor_is_moderator := editorial_role in ('admin','editor','reviewer');

  if actor = current_row.author_id then
    if new_status = 'submitted'
       and current_row.type in ('correction','relationship','genealogy','language')
       and not exists (select 1 from public.contribution_sources cs where cs.contribution_id = target_id) then
      raise exception 'Evidence source required for this contribution type';
    end if;

    if not (
      (current_row.status in ('draft','needs_evidence') and new_status = 'submitted')
      or (current_row.status in ('draft','submitted','needs_evidence') and new_status = 'withdrawn')
    ) then
      raise exception 'Author transition not allowed';
    end if;
  elsif actor_is_moderator then
    if not (
      (current_row.status in ('submitted','needs_evidence') and new_status in ('in_review','needs_evidence','rejected','disputed'))
      or (current_row.status = 'in_review' and new_status in ('needs_evidence','accepted','merged','rejected','disputed'))
      or (current_row.status = 'accepted' and new_status in ('merged','in_review'))
    ) then
      raise exception 'Moderator transition not allowed';
    end if;

    if new_status = 'merged' and editorial_role not in ('admin','editor') then
      raise exception 'Only editor/admin can mark a contribution merged';
    end if;
  else
    raise exception 'Not allowed';
  end if;

  action_name := case new_status
    when 'submitted' then 'submitted'
    when 'needs_evidence' then 'requested_evidence'
    when 'in_review' then 'started_review'
    when 'accepted' then 'accepted'
    when 'merged' then 'merged'
    when 'rejected' then 'rejected'
    when 'disputed' then 'marked_disputed'
    when 'withdrawn' then 'withdrawn'
    else 'status_changed'
  end;

  update public.contributions
  set
    status = new_status,
    moderator_id = case when actor_is_moderator then actor else moderator_id end,
    moderation_note = case when actor_is_moderator and transition_note is not null then transition_note else moderation_note end,
    submitted_at = case when new_status = 'submitted' then now() else submitted_at end,
    reviewed_at = case when new_status in ('accepted','merged','rejected','disputed') then now() else reviewed_at end,
    merged_at = case when new_status = 'merged' then now() else merged_at end,
    updated_at = now()
  where id = target_id;

  insert into public.contribution_audit_log(
    contribution_id, actor_id, action, from_status, to_status, detail, visible_to_author
  ) values (
    target_id, actor, action_name, current_row.status, new_status,
    jsonb_build_object('note', transition_note), true
  );

  if actor <> current_row.author_id then
    insert into public.community_notifications(user_id, kind, title, body, href)
    values (
      current_row.author_id,
      'contribution_status',
      'Status kontribusi diperbarui',
      'Kontribusi "' || current_row.title || '" sekarang berstatus ' || new_status::text || '.',
      '/contribute/' || target_id::text
    );
  end if;

  if new_status in ('accepted','merged') then
    insert into public.revisions(table_name,row_id,snapshot,changed_by,change_note)
    select
      'contributions',
      c.id,
      to_jsonb(c),
      actor,
      coalesce(transition_note, 'Community contribution ' || new_status::text)
    from public.contributions c where c.id = target_id;
  end if;
end;
$$;

grant execute on function public.transition_contribution_status(uuid, public.contribution_status, text) to authenticated;

create or replace function public.get_public_contributor_stats(profile_slug text)
returns table (
  submitted_count bigint,
  accepted_count bigint,
  merged_count bigint,
  disputed_count bigint,
  editorial_score bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    count(*) filter (where c.status not in ('draft','withdrawn')) as submitted_count,
    count(*) filter (where c.status = 'accepted') as accepted_count,
    count(*) filter (where c.status = 'merged') as merged_count,
    count(*) filter (where c.status = 'disputed') as disputed_count,
    (
      count(*) filter (where c.status = 'accepted') * 2
      + count(*) filter (where c.status = 'merged') * 3
    )::bigint as editorial_score
  from public.contributor_profiles cp
  left join public.contributions c on c.author_id = cp.user_id
  where cp.slug = profile_slug and cp.is_public = true;
$$;

grant execute on function public.get_public_contributor_stats(text) to anon, authenticated;

-- Row level security.
alter table public.community_memberships enable row level security;
alter table public.contributor_profiles enable row level security;
alter table public.contributions enable row level security;
alter table public.contribution_sources enable row level security;
alter table public.contribution_messages enable row level security;
alter table public.contribution_audit_log enable row level security;
alter table public.content_reports enable row level security;
alter table public.community_notifications enable row level security;

create policy "membership_self_or_editorial_read" on public.community_memberships for select
to authenticated
using (user_id = (select auth.uid()) or public.is_community_moderator());

create policy "membership_admin_write" on public.community_memberships for all
to authenticated
using (public.is_community_admin()) with check (public.is_community_admin());

create policy "contributor_profiles_public_read" on public.contributor_profiles for select
to anon, authenticated
using (is_public = true or user_id = (select auth.uid()) or public.is_community_moderator());

create policy "contributor_profiles_self_insert" on public.contributor_profiles for insert
to authenticated
with check (user_id = (select auth.uid()) and public.is_active_contributor());

create policy "contributor_profiles_self_update" on public.contributor_profiles for update
to authenticated
using (user_id = (select auth.uid()) and public.is_active_contributor())
with check (user_id = (select auth.uid()) and public.is_active_contributor());

create policy "contributions_owner_or_moderator_read" on public.contributions for select
to authenticated
using (author_id = (select auth.uid()) or public.is_community_moderator());

create policy "contributions_owner_insert" on public.contributions for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.is_active_contributor()
  and status = 'draft'
);

create policy "contributions_owner_draft_update" on public.contributions for update
to authenticated
using (
  author_id = (select auth.uid())
  and public.is_active_contributor()
  and status in ('draft','needs_evidence')
)
with check (
  author_id = (select auth.uid())
  and public.is_active_contributor()
  and status in ('draft','needs_evidence')
);

create policy "contribution_sources_owner_or_moderator_read" on public.contribution_sources for select
to authenticated
using (
  public.is_community_moderator()
  or exists (
    select 1 from public.contributions c
    where c.id = contribution_id and c.author_id = (select auth.uid())
  )
);

create policy "contribution_sources_owner_insert" on public.contribution_sources for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.is_active_contributor()
  and exists (
    select 1 from public.contributions c
    where c.id = contribution_id and c.author_id = (select auth.uid())
      and c.status in ('draft','needs_evidence')
  )
);

create policy "contribution_sources_owner_delete" on public.contribution_sources for delete
to authenticated
using (
  created_by = (select auth.uid())
  and exists (
    select 1 from public.contributions c
    where c.id = contribution_id and c.author_id = (select auth.uid())
      and c.status in ('draft','needs_evidence')
  )
);

create policy "contribution_messages_read" on public.contribution_messages for select
to authenticated
using (
  public.is_community_moderator()
  or exists (
    select 1 from public.contributions c
    where c.id = contribution_id and c.author_id = (select auth.uid())
  ) and is_internal = false
);

create policy "contribution_messages_contributor_insert" on public.contribution_messages for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.is_active_contributor()
  and is_internal = false
  and message_type in ('comment','response')
  and exists (
    select 1 from public.contributions c
    where c.id = contribution_id and c.author_id = (select auth.uid())
  )
);

create policy "contribution_messages_moderator_insert" on public.contribution_messages for insert
to authenticated
with check (public.is_community_moderator());

create policy "contribution_audit_read" on public.contribution_audit_log for select
to authenticated
using (
  public.is_community_moderator()
  or (
    visible_to_author = true
    and exists (
      select 1 from public.contributions c
      where c.id = contribution_id and c.author_id = (select auth.uid())
    )
  )
);

create policy "content_reports_owner_or_moderator_read" on public.content_reports for select
to authenticated
using (reporter_id = (select auth.uid()) or public.is_community_moderator());

create policy "content_reports_contributor_insert" on public.content_reports for insert
to authenticated
with check (reporter_id = (select auth.uid()) and public.is_active_contributor());

create policy "content_reports_moderator_update" on public.content_reports for update
to authenticated
using (public.is_community_moderator()) with check (public.is_community_moderator());

create policy "notifications_owner_read" on public.community_notifications for select
to authenticated
using (user_id = (select auth.uid()));

create policy "notifications_owner_mark_read" on public.community_notifications for update
to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Make contributor mutations explicit at the SQL privilege layer too.
revoke all on table public.community_memberships from anon, authenticated;
grant select on table public.community_memberships to authenticated;

revoke all on table public.contributor_profiles from anon, authenticated;
grant select on table public.contributor_profiles to anon, authenticated;
grant insert (user_id,slug,display_name,bio,interests,is_public) on table public.contributor_profiles to authenticated;
grant update (slug,display_name,bio,interests,is_public,updated_at) on table public.contributor_profiles to authenticated;

revoke all on table public.contributions from anon, authenticated;
grant select on table public.contributions to authenticated;
grant insert (author_id,type,target_entity_id,title,section_key,rationale,proposed_content) on table public.contributions to authenticated;
grant update (type,target_entity_id,title,section_key,rationale,proposed_content,updated_at) on table public.contributions to authenticated;

revoke all on table public.contribution_sources from anon, authenticated;
grant select, insert, delete on table public.contribution_sources to authenticated;

revoke all on table public.contribution_messages from anon, authenticated;
grant select, insert on table public.contribution_messages to authenticated;

revoke all on table public.contribution_audit_log from anon, authenticated;
grant select on table public.contribution_audit_log to authenticated;

revoke all on table public.content_reports from anon, authenticated;
grant select, insert, update on table public.content_reports to authenticated;

revoke all on table public.community_notifications from anon, authenticated;
grant select on table public.community_notifications to authenticated;
grant update (read_at) on table public.community_notifications to authenticated;

-- Moderation views expose only operational metadata to editorial roles through RLS-protected tables.
create or replace view public.community_moderation_queue
with (security_invoker = true)
as
select
  c.id,
  c.type,
  c.title,
  c.status,
  c.author_id,
  cp.display_name as contributor_name,
  c.target_entity_id,
  e.title as target_entity_title,
  c.submitted_at,
  c.updated_at
from public.contributions c
left join public.contributor_profiles cp on cp.user_id = c.author_id
left join public.entities e on e.id = c.target_entity_id
where c.status in ('submitted','needs_evidence','in_review','accepted','disputed');

grant select on public.community_moderation_queue to authenticated;
