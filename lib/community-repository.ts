import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CommunityNotificationRow,
  ContentReportRow,
  ContributionAuditRow,
  ContributionMessageRow,
  ContributionRow,
  ContributionSourceRow,
  ContributorProfile,
  ContributorStats,
} from "@/lib/community-types";

// Database columns use snake_case; domain objects use camelCase.
type SnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${First extends Lowercase<First> ? First : `_${Lowercase<First>}`}${SnakeCase<Rest>}`
  : S;
type DatabaseRow<T> = { [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K] };
type ContributionDatabaseRow = DatabaseRow<ContributionRow> & { target?: { title: string } | null };
type ReportDatabaseRow = DatabaseRow<ContentReportRow> & { entity?: { title: string } | null };
type SourceDatabaseRow = DatabaseRow<ContributionSourceRow> & { source?: { title: string } | null };

function mapContribution(row: ContributionDatabaseRow): ContributionRow {
  return {
    id: row.id,
    authorId: row.author_id,
    type: row.type,
    targetEntityId: row.target_entity_id,
    targetEntityTitle: row.target?.title ?? row.target_entity_title ?? null,
    title: row.title,
    sectionKey: row.section_key,
    rationale: row.rationale,
    proposedContent: row.proposed_content ?? "",
    status: row.status,
    moderationNote: row.moderation_note,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    mergedAt: row.merged_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOwnContributions(userId: string): Promise<ContributionRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("contributions")
    .select("*,target:entities(title)")
    .eq("author_id", userId)
    .order("updated_at", { ascending: false });
  return (data ?? []).map(mapContribution);
}

export async function getContributionDetail(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const [contributionResult, sourcesResult, messagesResult, auditResult] = await Promise.all([
    supabase.from("contributions").select("*,target:entities(title)").eq("id", id).maybeSingle(),
    supabase
      .from("contribution_sources")
      .select("*,source:sources(title)")
      .eq("contribution_id", id)
      .order("created_at"),
    supabase
      .from("contribution_messages")
      .select("id,contribution_id,author_id,message_type,body,is_internal,created_at")
      .eq("contribution_id", id)
      .order("created_at"),
    supabase
      .from("contribution_audit_log")
      .select("id,contribution_id,action,from_status,to_status,detail,created_at")
      .eq("contribution_id", id)
      .order("created_at"),
  ]);

  if (!contributionResult.data) return null;

  return {
    contribution: mapContribution(contributionResult.data),
    sources: (sourcesResult.data ?? []).map((row: SourceDatabaseRow): ContributionSourceRow => ({
      id: row.id,
      contributionId: row.contribution_id,
      sourceId: row.source_id,
      sourceTitle: row.source?.title ?? null,
      proposedTitle: row.proposed_title,
      proposedUrl: row.proposed_url,
      locator: row.locator,
      note: row.note,
      createdAt: row.created_at,
    })),
    messages: (messagesResult.data ?? []).map((row: DatabaseRow<ContributionMessageRow>): ContributionMessageRow => ({
      id: row.id,
      contributionId: row.contribution_id,
      authorId: row.author_id,
      messageType: row.message_type,
      body: row.body,
      isInternal: row.is_internal,
      createdAt: row.created_at,
    })),
    audit: (auditResult.data ?? []).map((row: DatabaseRow<ContributionAuditRow>): ContributionAuditRow => ({
      id: Number(row.id),
      contributionId: row.contribution_id,
      action: row.action,
      fromStatus: row.from_status,
      toStatus: row.to_status,
      detail: row.detail ?? {},
      createdAt: row.created_at,
    })),
  };
}

export async function getCommunityFormOptions() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { entities: [], sources: [] };
  const [entities, sources] = await Promise.all([
    supabase.from("entities").select("id,title,type").eq("status", "published").order("title").limit(250),
    supabase.from("sources").select("id,title,level").eq("status", "published").order("title").limit(250),
  ]);
  return { entities: entities.data ?? [], sources: sources.data ?? [] };
}

export async function getOwnNotifications(userId: string): Promise<CommunityNotificationRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("community_notifications")
    .select("id,kind,title,body,href,read_at,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []).map((row: DatabaseRow<CommunityNotificationRow>) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    href: row.href,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));
}

export async function getPublicContributor(slug: string): Promise<{ profile: ContributorProfile; stats: ContributorStats } | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: profile } = await supabase
    .from("contributor_profiles")
    .select("user_id,slug,display_name,bio,interests,is_public")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (!profile) return null;

  const { data: statsRows } = await supabase.rpc("get_public_contributor_stats", { profile_slug: slug });
  const stats = Array.isArray(statsRows) ? statsRows[0] : statsRows;

  return {
    profile: {
      userId: profile.user_id,
      slug: profile.slug,
      displayName: profile.display_name,
      bio: profile.bio ?? "",
      interests: profile.interests ?? [],
      isPublic: Boolean(profile.is_public),
    },
    stats: {
      submittedCount: Number(stats?.submitted_count ?? 0),
      acceptedCount: Number(stats?.accepted_count ?? 0),
      mergedCount: Number(stats?.merged_count ?? 0),
      disputedCount: Number(stats?.disputed_count ?? 0),
      editorialScore: Number(stats?.editorial_score ?? 0),
    },
  };
}

export async function getOwnReports(userId: string): Promise<ContentReportRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_reports")
    .select("*,entity:entities(title)")
    .eq("reporter_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapReport);
}

function mapReport(row: ReportDatabaseRow): ContentReportRow {
  return {
    id: row.id,
    reporterId: row.reporter_id,
    entityId: row.entity_id,
    entityTitle: row.entity?.title ?? row.entity_title ?? null,
    urlPath: row.url_path,
    category: row.category,
    description: row.description,
    status: row.status,
    resolutionNote: row.resolution_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCommunityModerationSnapshot() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { queue: [], reports: [], memberships: [] };

  const [queueResult, reportsResult, membershipsResult, profilesResult] = await Promise.all([
    supabase
      .from("community_moderation_queue")
      .select("id,type,title,status,author_id,contributor_name,target_entity_id,target_entity_title,submitted_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase
      .from("content_reports")
      .select("*,entity:entities(title)")
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase
      .from("community_memberships")
      .select("user_id,status,invited_at,activated_at,suspended_at")
      .order("invited_at", { ascending: false })
      .limit(100),
    supabase.from("contributor_profiles").select("user_id,display_name,slug,is_public"),
  ]);

  return {
    queue: queueResult.data ?? [],
    reports: (reportsResult.data ?? []).map(mapReport),
    memberships: (membershipsResult.data ?? []).map((row) => {
      const profile = (profilesResult.data ?? []).find((item) => item.user_id === row.user_id);
      return { ...row, display_name: profile?.display_name ?? null, slug: profile?.slug ?? null, is_public: Boolean(profile?.is_public) };
    }),
  };
}
