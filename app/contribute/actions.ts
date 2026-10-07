"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContributionStatus, ContributionType } from "@/lib/community-types";
import { canEditContribution } from "@/lib/community-workflow";

const contributionTypes = new Set<ContributionType>([
  "correction", "source", "new_content", "relationship", "genealogy", "language", "media",
]);

async function requireContributor() {
  const state = await getCommunityState();
  if (state.state !== "active") throw new Error("Active contributor account required.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  return { state, supabase };
}

export async function createContributionDraft(formData: FormData) {
  const { state, supabase } = await requireContributor();
  const type = String(formData.get("type") ?? "") as ContributionType;
  const title = String(formData.get("title") ?? "").trim();
  const targetEntityId = String(formData.get("target_entity_id") ?? "").trim();
  const sectionKey = String(formData.get("section_key") ?? "").trim();
  const rationale = String(formData.get("rationale") ?? "").trim();
  const proposedContent = String(formData.get("proposed_content") ?? "").trim();

  if (!contributionTypes.has(type) || title.length < 5 || rationale.length < 10) {
    throw new Error("Contribution form tidak valid.");
  }

  const { data, error } = await supabase
    .from("contributions")
    .insert({
      author_id: state.userId,
      type,
      title,
      target_entity_id: targetEntityId || null,
      section_key: sectionKey || null,
      rationale,
      proposed_content: proposedContent,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Contribution gagal dibuat.");
  redirect(`/contribute/${data.id}`);
}

export async function updateContributionDraft(formData: FormData) {
  const { state, supabase } = await requireContributor();
  const id = String(formData.get("id") ?? "");
  const { data: current } = await supabase
    .from("contributions")
    .select("status")
    .eq("id", id)
    .eq("author_id", state.userId)
    .maybeSingle();
  if (!current || !canEditContribution(current.status as ContributionStatus)) {
    throw new Error("Contribution tidak dapat diedit pada status ini.");
  }

  const type = String(formData.get("type") ?? "") as ContributionType;
  const title = String(formData.get("title") ?? "").trim();
  const targetEntityId = String(formData.get("target_entity_id") ?? "").trim();
  const sectionKey = String(formData.get("section_key") ?? "").trim();
  const rationale = String(formData.get("rationale") ?? "").trim();
  const proposedContent = String(formData.get("proposed_content") ?? "").trim();
  if (!contributionTypes.has(type) || title.length < 5 || rationale.length < 10) {
    throw new Error("Contribution form tidak valid.");
  }

  const { error } = await supabase
    .from("contributions")
    .update({ type, title, target_entity_id: targetEntityId || null, section_key: sectionKey || null, rationale, proposed_content: proposedContent })
    .eq("id", id)
    .eq("author_id", state.userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/contribute/${id}`);
}

export async function addContributionSource(formData: FormData) {
  const { state, supabase } = await requireContributor();
  const contributionId = String(formData.get("contribution_id") ?? "");
  const sourceId = String(formData.get("source_id") ?? "").trim();
  const proposedTitle = String(formData.get("proposed_title") ?? "").trim();
  const proposedUrl = String(formData.get("proposed_url") ?? "").trim();
  const locator = String(formData.get("locator") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!contributionId || (!sourceId && !proposedTitle && !proposedUrl)) {
    throw new Error("Tambahkan sumber existing atau metadata sumber usulan.");
  }
  const { error } = await supabase.from("contribution_sources").insert({
    contribution_id: contributionId,
    source_id: sourceId || null,
    proposed_title: proposedTitle || null,
    proposed_url: proposedUrl || null,
    locator: locator || null,
    note: note || null,
    created_by: state.userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/contribute/${contributionId}`);
}

export async function addContributorMessage(formData: FormData) {
  const { state, supabase } = await requireContributor();
  const contributionId = String(formData.get("contribution_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!contributionId || body.length < 2) throw new Error("Pesan tidak valid.");
  const { error } = await supabase.from("contribution_messages").insert({
    contribution_id: contributionId,
    author_id: state.userId,
    message_type: "response",
    body,
    is_internal: false,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/contribute/${contributionId}`);
}

export async function transitionOwnContribution(formData: FormData) {
  await requireContributor();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ContributionStatus;
  if (!id || !["submitted", "withdrawn"].includes(status)) throw new Error("Invalid transition.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  const { error } = await supabase.rpc("transition_contribution_status", {
    target_id: id,
    new_status: status,
    transition_note: null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/contribute/${id}`);
  revalidatePath("/account/contributions");
}

export async function createContentReport(formData: FormData) {
  const { state, supabase } = await requireContributor();
  const entityId = String(formData.get("entity_id") ?? "").trim();
  const urlPath = String(formData.get("url_path") ?? "").trim();
  const category = String(formData.get("category") ?? "other");
  const description = String(formData.get("description") ?? "").trim();
  const allowed = ["incorrect","missing_source","cultural_sensitivity","privacy","copyright","other"];
  if (!allowed.includes(category) || description.length < 10) throw new Error("Report tidak valid.");
  const { error } = await supabase.from("content_reports").insert({
    reporter_id: state.userId,
    entity_id: entityId || null,
    url_path: urlPath || null,
    category,
    description,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/report");
  redirect("/report?submitted=1");
}
