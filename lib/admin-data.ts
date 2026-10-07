import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EditorialEntityRow = {
  id: string;
  title: string;
  type: string;
  status: "draft" | "in_review" | "published" | "archived";
};

export type EditorialSourceRow = {
  id: string;
  title: string;
  level: "A" | "B" | "C" | "D";
  status: "draft" | "in_review" | "published" | "archived";
};

export type EditorialClaimRow = {
  id: string;
  body: string;
  status:
    | "verified"
    | "supported"
    | "regional_variation"
    | "disputed"
    | "community_sourced"
    | "draft";
  entity_id: string;
};


export type EditorialGenealogyDatasetRow = { id: string; title: string; visibility: string; status: "draft" | "in_review" | "published" | "archived" };
export type EditorialGenealogyEdgeRow = { id: string; relation: string; status: "verified" | "supported" | "regional_variation" | "disputed" | "community_sourced" | "draft"; context_note: string | null };
export type EditorialKinshipRuleRow = { id: string; term: string; cultural_context: string; status: "verified" | "supported" | "regional_variation" | "disputed" | "community_sourced" | "draft"; publication_status: "draft" | "in_review" | "published" | "archived" };

export async function getEditorialSnapshot() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { entities: [], sources: [], claims: [], genealogyDatasets: [], genealogyEdges: [], kinshipRules: [] };

  const [entitiesResult, sourcesResult, claimsResult, genealogyDatasetsResult, genealogyEdgesResult, kinshipRulesResult] = await Promise.all([
    supabase.from("entities").select("id,title,type,status").order("updated_at", { ascending: false }).limit(20),
    supabase.from("sources").select("id,title,level,status").order("updated_at", { ascending: false }).limit(20),
    supabase.from("claims").select("id,body,status,entity_id").order("updated_at", { ascending: false }).limit(20),
    supabase.from("genealogy_datasets").select("id,title,visibility,status").order("updated_at", { ascending: false }).limit(20),
    supabase.from("genealogy_edges").select("id,relation,status,context_note").order("updated_at", { ascending: false }).limit(20),
    supabase.from("kinship_rules").select("id,term,cultural_context,status,publication_status").order("updated_at", { ascending: false }).limit(20),
  ]);

  return {
    entities: (entitiesResult.data ?? []) as EditorialEntityRow[],
    sources: (sourcesResult.data ?? []) as EditorialSourceRow[],
    claims: (claimsResult.data ?? []) as EditorialClaimRow[],
    genealogyDatasets: (genealogyDatasetsResult.data ?? []) as EditorialGenealogyDatasetRow[],
    genealogyEdges: (genealogyEdgesResult.data ?? []) as EditorialGenealogyEdgeRow[],
    kinshipRules: (kinshipRulesResult.data ?? []) as EditorialKinshipRuleRow[],
  };
}

export async function getClaimFormOptions() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { entities: [], sources: [] };

  const [entitiesResult, sourcesResult] = await Promise.all([
    supabase.from("entities").select("id,title").order("title"),
    supabase.from("sources").select("id,title").order("title"),
  ]);

  return {
    entities: (entitiesResult.data ?? []) as Array<{ id: string; title: string }>,
    sources: (sourcesResult.data ?? []) as Array<{ id: string; title: string }>,
  };
}

export async function getPhase3FormOptions() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { datasets: [], nodes: [], sources: [] };
  const [datasetsResult, nodesResult, sourcesResult] = await Promise.all([
    supabase.from("genealogy_datasets").select("id,title").order("title"),
    supabase.from("genealogy_nodes").select("id,label,dataset_id").order("generation").order("label"),
    supabase.from("sources").select("id,title").order("title"),
  ]);
  return {
    datasets: (datasetsResult.data ?? []) as Array<{ id: string; title: string }>,
    nodes: (nodesResult.data ?? []) as Array<{ id: string; label: string; dataset_id: string }>,
    sources: (sourcesResult.data ?? []) as Array<{ id: string; title: string }>,
  };
}
