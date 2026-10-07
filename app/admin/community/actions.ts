"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEditorialState } from "@/lib/auth/editor";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContributionStatus } from "@/lib/community-types";

async function requireModerator() {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized") throw new Error("Editorial authentication required.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  return { editorial, supabase };
}

export async function inviteContributor(formData: FormData) {
  const { editorial } = await requireModerator();
  if (editorial.role !== "admin") throw new Error("Only admin can invite contributors.");
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("SUPABASE_SECRET_KEY belum dikonfigurasi.");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!email.includes("@") || displayName.length < 2) throw new Error("Invite form tidak valid.");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  let userId: string | undefined;
  const inviteResult = await admin.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName, invitation_scope: "community_contributor" },
    redirectTo: `${siteUrl}/account/welcome`,
  });

  if (!inviteResult.error && inviteResult.data.user) {
    userId = inviteResult.data.user.id;
  } else {
    const existing = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = existing.data?.users.find((candidate: any) => candidate.email?.toLowerCase() === email);
    if (!user) throw new Error(inviteResult.error?.message ?? "User invitation failed.");
    userId = user.id;
  }

  const { data: existingMembership, error: membershipReadError } = await admin
    .from("community_memberships")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  if (membershipReadError) throw new Error(membershipReadError.message);

  // A repeat invite must never silently downgrade an already-active contributor.
  if (existingMembership?.status !== "active") {
    const { error } = await admin.from("community_memberships").upsert({
      user_id: userId,
      status: "invited",
      invited_by: editorial.userId,
      invited_at: new Date().toISOString(),
      suspended_at: null,
    }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/community");
  redirect("/admin/community?invited=1");
}

export async function updateContributorMembership(formData: FormData) {
  const { editorial } = await requireModerator();
  if (editorial.role !== "admin") throw new Error("Only admin can manage contributor access.");
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("SUPABASE_SECRET_KEY belum dikonfigurasi.");
  const userId = String(formData.get("user_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!userId || !["invited","active","suspended"].includes(status)) throw new Error("Invalid membership update.");
  const now = new Date().toISOString();
  const patch: Record<string, string | null> = {
    status,
    suspended_at: status === "suspended" ? now : null,
  };
  if (status === "active") patch.activated_at = now;

  const { error } = await admin.from("community_memberships").update(patch).eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/community");
}

export async function moderateContribution(formData: FormData) {
  const { supabase } = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ContributionStatus;
  const note = String(formData.get("note") ?? "").trim();
  const allowed: ContributionStatus[] = ["needs_evidence","in_review","accepted","merged","rejected","disputed"];
  if (!id || !allowed.includes(status)) throw new Error("Invalid moderation transition.");
  const { error } = await supabase.rpc("transition_contribution_status", {
    target_id: id,
    new_status: status,
    transition_note: note || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/community");
  revalidatePath(`/contribute/${id}`);
}

export async function addModeratorMessage(formData: FormData) {
  const { editorial, supabase } = await requireModerator();
  const contributionId = String(formData.get("contribution_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const messageType = String(formData.get("message_type") ?? "comment");
  const isInternal = formData.get("is_internal") === "on";
  if (!contributionId || body.length < 2 || !["comment","evidence_request","decision"].includes(messageType)) {
    throw new Error("Moderator message tidak valid.");
  }
  const { error } = await supabase.from("contribution_messages").insert({
    contribution_id: contributionId,
    author_id: editorial.userId,
    message_type: messageType,
    body,
    is_internal: isInternal,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/community");
  revalidatePath(`/contribute/${contributionId}`);
}

export async function moderateContentReport(formData: FormData) {
  const { supabase } = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const resolutionNote = String(formData.get("resolution_note") ?? "").trim();
  if (!id || !["triaged","resolved","dismissed"].includes(status)) throw new Error("Invalid report status.");
  const { error } = await supabase.from("content_reports").update({
    status,
    resolution_note: resolutionNote || null,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/community");
}
