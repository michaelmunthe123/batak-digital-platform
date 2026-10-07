import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContributorProfile, CommunityMembershipStatus } from "@/lib/community-types";

export type CommunityState =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "not_member"; userId: string; email?: string }
  | { state: "invited"; userId: string; email?: string }
  | { state: "suspended"; userId: string; email?: string }
  | { state: "active"; userId: string; email?: string; profile?: ContributorProfile };

export async function getCommunityState(): Promise<CommunityState> {
  if (!hasSupabaseEnv()) return { state: "unconfigured" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "unconfigured" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { state: "anonymous" };

  const { data: membership } = await supabase
    .from("community_memberships")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return { state: "not_member", userId: user.id, email: user.email };
  const status = membership.status as CommunityMembershipStatus;
  if (status === "invited") return { state: "invited", userId: user.id, email: user.email };
  if (status === "suspended") return { state: "suspended", userId: user.id, email: user.email };

  const { data: profile } = await supabase
    .from("contributor_profiles")
    .select("user_id,slug,display_name,bio,interests,is_public")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    state: "active",
    userId: user.id,
    email: user.email,
    profile: profile ? {
      userId: profile.user_id,
      slug: profile.slug,
      displayName: profile.display_name,
      bio: profile.bio ?? "",
      interests: profile.interests ?? [],
      isPublic: Boolean(profile.is_public),
    } : undefined,
  };
}
