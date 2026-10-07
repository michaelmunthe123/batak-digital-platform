"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEditorialState } from "@/lib/auth/editor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set([
  "cultural_group",
  "clan",
  "region",
  "tradition",
  "kinship_system",
  "kinship_term",
  "language_variety",
  "artifact",
  "performance",
  "textile",
  "architecture",
  "cuisine",
]);

async function requireAuthorized() {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized") {
    throw new Error("Editorial authentication required.");
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  return { editorial, supabase };
}

export async function createEntityDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") {
    throw new Error("Reviewer tidak memiliki izin membuat draft entity.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const type = String(formData.get("type") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();

  if (!title || !slug || !allowedTypes.has(type)) {
    throw new Error("Field draft tidak valid.");
  }

  const { error } = await supabase.from("entities").insert({
    title,
    slug,
    type,
    summary,
    status: "draft",
    created_by: editorial.userId,
    updated_by: editorial.userId,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin?created=entity");
}

export async function createSourceDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") {
    throw new Error("Reviewer tidak memiliki izin membuat sumber.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const publisher = String(formData.get("publisher") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const type = String(formData.get("type") ?? "institutional");
  const level = String(formData.get("level") ?? "B");
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !["A","B","C","D"].includes(level)) {
    throw new Error("Source form tidak valid.");
  }

  const { error } = await supabase.from("sources").insert({
    title,
    publisher: publisher || null,
    url: url || null,
    type,
    level,
    description,
    status: "draft",
    created_by: editorial.userId,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin?created=source");
}

export async function createClaimDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") {
    throw new Error("Reviewer tidak memiliki izin menulis claim baru.");
  }

  const entityId = String(formData.get("entity_id") ?? "");
  const sourceId = String(formData.get("source_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const locator = String(formData.get("locator") ?? "").trim();

  if (!entityId || !sourceId || !body) {
    throw new Error("Claim harus memiliki entity, source, dan body.");
  }

  const { data: claim, error } = await supabase
    .from("claims")
    .insert({
      entity_id: entityId,
      body,
      status: "draft",
      created_by: editorial.userId,
    })
    .select("id")
    .single();

  if (error || !claim) throw new Error(error?.message ?? "Claim gagal dibuat.");

  const { error: linkError } = await supabase.from("claim_sources").insert({
    claim_id: claim.id,
    source_id: sourceId,
    locator: locator || null,
    support_type: "supports",
  });

  if (linkError) throw new Error(linkError.message);

  revalidatePath("/admin");
  redirect("/admin?created=claim");
}

export async function transitionEntityStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("status") ?? "");
  const { error } = await supabase.rpc("transition_entity_status", {
    target_id: targetId,
    new_status: newStatus,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function transitionSourceStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("status") ?? "");
  const { error } = await supabase.rpc("transition_source_status", {
    target_id: targetId,
    new_status: newStatus,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function transitionClaimStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("status") ?? "");
  const { error } = await supabase.rpc("transition_claim_status", {
    target_id: targetId,
    new_status: newStatus,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function createGenealogyDatasetDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") throw new Error("Reviewer tidak membuat dataset genealogy.");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim();
  const culturalContext = String(formData.get("cultural_context") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "restricted");
  const methodologyNote = String(formData.get("methodology_note") ?? "").trim();
  if (!title || !slug || !["public","restricted","private"].includes(visibility)) throw new Error("Dataset form tidak valid.");
  const { error } = await supabase.from("genealogy_datasets").insert({
    title, slug, description, cultural_context: culturalContext || null, visibility,
    methodology_note: methodologyNote, status: "draft", created_by: editorial.userId, updated_by: editorial.userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin?created=genealogy-dataset");
}

export async function createGenealogyNodeDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") throw new Error("Reviewer tidak membuat node genealogy.");
  const datasetId = String(formData.get("dataset_id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const generation = Number(formData.get("generation") ?? 0);
  const gender = String(formData.get("gender") ?? "unknown");
  const livingStatus = String(formData.get("living_status") ?? "unknown");
  const privacyLevel = String(formData.get("privacy_level") ?? "restricted");
  const note = String(formData.get("note") ?? "").trim();
  if (!datasetId || !label || !Number.isInteger(generation)) throw new Error("Node form tidak valid.");
  if (livingStatus === "living" && privacyLevel === "public") throw new Error("Orang hidup tidak boleh public.");
  const { error } = await supabase.from("genealogy_nodes").insert({
    dataset_id: datasetId, label, generation, gender, living_status: livingStatus,
    privacy_level: privacyLevel, note: note || null, status: "draft",
    created_by: editorial.userId, updated_by: editorial.userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin?created=genealogy-node");
}

export async function createGenealogyEdgeDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") throw new Error("Reviewer tidak membuat edge genealogy.");
  const datasetId = String(formData.get("dataset_id") ?? "");
  const sourceNodeId = String(formData.get("source_node_id") ?? "");
  const targetNodeId = String(formData.get("target_node_id") ?? "");
  const relation = String(formData.get("relation") ?? "");
  const sourceId = String(formData.get("source_id") ?? "");
  const locator = String(formData.get("locator") ?? "").trim();
  const contextNote = String(formData.get("context_note") ?? "").trim();
  if (!datasetId || !sourceNodeId || !targetNodeId || !sourceId || sourceNodeId === targetNodeId) throw new Error("Edge membutuhkan dataset, dua node berbeda, dan sumber.");
  const { data: edge, error } = await supabase.from("genealogy_edges").insert({
    dataset_id: datasetId, source_node_id: sourceNodeId, target_node_id: targetNodeId,
    relation, status: "draft", context_note: contextNote || null, created_by: editorial.userId,
  }).select("id").single();
  if (error || !edge) throw new Error(error?.message ?? "Edge gagal dibuat.");
  const { error: sourceError } = await supabase.from("genealogy_edge_sources").insert({
    edge_id: edge.id, source_id: sourceId, locator: locator || null, support_type: "supports",
  });
  if (sourceError) throw new Error(sourceError.message);
  revalidatePath("/admin");
  redirect("/admin?created=genealogy-edge");
}

export async function createKinshipRuleDraft(formData: FormData) {
  const { editorial, supabase } = await requireAuthorized();
  if (editorial.role === "reviewer") throw new Error("Reviewer tidak membuat kinship rule.");
  const culturalContext = String(formData.get("cultural_context") ?? "").trim();
  const relationCode = String(formData.get("relation_code") ?? "").trim().toLowerCase();
  const relationLabelId = String(formData.get("relation_label_id") ?? "").trim();
  const term = String(formData.get("term") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const caution = String(formData.get("caution") ?? "").trim();
  const sourceId = String(formData.get("source_id") ?? "");
  const locator = String(formData.get("locator") ?? "").trim();
  if (!culturalContext || !relationCode || !relationLabelId || !term || !explanation || !sourceId) throw new Error("Kinship rule wajib memiliki konteks dan sumber.");
  const { data: rule, error } = await supabase.from("kinship_rules").insert({
    cultural_context: culturalContext, relation_code: relationCode, relation_label_id: relationLabelId,
    term, explanation, caution: caution || null, status: "draft", publication_status: "draft",
    created_by: editorial.userId,
  }).select("id").single();
  if (error || !rule) throw new Error(error?.message ?? "Rule gagal dibuat.");
  const { error: sourceError } = await supabase.from("kinship_rule_sources").insert({
    rule_id: rule.id, source_id: sourceId, locator: locator || null, support_type: "supports",
  });
  if (sourceError) throw new Error(sourceError.message);
  revalidatePath("/admin");
  redirect("/admin?created=kinship-rule");
}

export async function transitionGenealogyDatasetStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("status") ?? "");
  const { error } = await supabase.rpc("transition_genealogy_dataset_status", { target_id: targetId, new_status: newStatus });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function transitionGenealogyEdgeStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const newStatus = String(formData.get("status") ?? "");
  const { error } = await supabase.rpc("transition_genealogy_edge_status", { target_id: targetId, new_status: newStatus });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function transitionKinshipRuleStatus(formData: FormData) {
  const { supabase } = await requireAuthorized();
  const targetId = String(formData.get("id") ?? "");
  const claimStatus = String(formData.get("claim_status") ?? "draft");
  const publicationStatus = String(formData.get("publication_status") ?? "draft");
  const { error } = await supabase.rpc("transition_kinship_rule_status", {
    target_id: targetId,
    new_claim_status: claimStatus,
    new_publication_status: publicationStatus,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
