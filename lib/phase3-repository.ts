import { pilotGenealogyGraph, pilotKinshipRules, pilotRelationshipEdges } from "@/lib/phase3-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  GenealogyDataset,
  GenealogyEdge,
  GenealogyGraph,
  GenealogyNode,
  KinshipRule,
  RelationshipEdge,
} from "@/lib/types";

export async function listGenealogyDatasets(): Promise<GenealogyDataset[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [pilotGenealogyGraph.dataset];

  const { data, error } = await supabase
    .from("genealogy_datasets")
    .select("id,slug,title,description,cultural_context,visibility,methodology_note,is_demo,genealogy_dataset_sources(source_id)")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("title");

  if (error || !data?.length) return [pilotGenealogyGraph.dataset];
  return (data as Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    cultural_context: string | null;
    visibility: GenealogyDataset["visibility"];
    methodology_note: string;
    is_demo: boolean;
    genealogy_dataset_sources?: { source_id: string }[];
  }>).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    culturalGroup: row.cultural_context ?? undefined,
    visibility: row.visibility,
    methodologyNote: row.methodology_note,
    sourceIds: row.genealogy_dataset_sources?.map((link) => link.source_id) ?? [],
    isDemo: row.is_demo,
  }));
}

export async function getGenealogyGraph(slug: string): Promise<GenealogyGraph | undefined> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return slug === pilotGenealogyGraph.dataset.slug ? pilotGenealogyGraph : undefined;

  const { data: dataset, error } = await supabase
    .from("genealogy_datasets")
    .select("id,slug,title,description,cultural_context,visibility,methodology_note,is_demo,status,genealogy_dataset_sources(source_id)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (error || !dataset) return slug === pilotGenealogyGraph.dataset.slug ? pilotGenealogyGraph : undefined;

  const [{ data: nodes }, { data: edges }] = await Promise.all([
    supabase
      .from("genealogy_nodes")
      .select("id,label,generation,gender,living_status,privacy_level,note,clan_entity_id")
      .eq("dataset_id", dataset.id)
      .eq("privacy_level", "public")
      .order("generation"),
    supabase
      .from("genealogy_edges")
      .select("id,source_node_id,target_node_id,relation,status,context_note,genealogy_edge_sources(source_id)")
      .eq("dataset_id", dataset.id)
      .neq("status", "draft"),
  ]);

  const mappedNodes: GenealogyNode[] = ((nodes ?? []) as Array<{
    id: string;
    label: string;
    generation: number;
    gender: GenealogyNode["gender"];
    living_status: GenealogyNode["livingStatus"];
    privacy_level: GenealogyNode["visibility"];
    note: string | null;
  }>).map((node) => ({
    id: node.id,
    datasetSlug: dataset.slug,
    label: node.label,
    generation: node.generation,
    gender: node.gender,
    livingStatus: node.living_status,
    visibility: node.privacy_level,
    note: node.note ?? undefined,
  }));

  const mappedEdges: GenealogyEdge[] = ((edges ?? []) as Array<{
    id: string;
    source_node_id: string;
    target_node_id: string;
    relation: GenealogyEdge["relation"];
    status: GenealogyEdge["status"];
    context_note: string | null;
    genealogy_edge_sources?: { source_id: string }[];
  }>).map((edge) => ({
    id: edge.id,
    datasetSlug: dataset.slug,
    sourceNodeId: edge.source_node_id,
    targetNodeId: edge.target_node_id,
    relation: edge.relation,
    status: edge.status,
    sourceIds: edge.genealogy_edge_sources?.map((link) => link.source_id) ?? [],
    contextNote: edge.context_note ?? undefined,
  }));

  return {
    dataset: {
      id: dataset.id,
      slug: dataset.slug,
      title: dataset.title,
      description: dataset.description,
      culturalGroup: dataset.cultural_context ?? undefined,
      visibility: dataset.visibility,
      methodologyNote: dataset.methodology_note,
      sourceIds: (dataset.genealogy_dataset_sources ?? []).map((link: { source_id: string }) => link.source_id),
      isDemo: dataset.is_demo,
    },
    nodes: mappedNodes,
    edges: mappedEdges,
  };
}

export async function listKinshipRules(): Promise<KinshipRule[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return pilotKinshipRules;

  const { data, error } = await supabase
    .from("kinship_rules")
    .select("id,cultural_context,relation_code,relation_label_id,term,explanation,status,caution,kinship_rule_sources(source_id)")
    .eq("publication_status", "published")
    .neq("status", "draft")
    .order("cultural_context")
    .order("term");

  if (error || !data?.length) return pilotKinshipRules;
  return (data as Array<{
    id: string;
    cultural_context: KinshipRule["culturalContext"];
    relation_code: string;
    relation_label_id: string;
    term: string;
    explanation: string;
    status: KinshipRule["status"];
    caution: string | null;
    kinship_rule_sources?: { source_id: string }[];
  }>).map((row) => ({
    id: row.id,
    culturalContext: row.cultural_context,
    relationCode: row.relation_code,
    relationLabelId: row.relation_label_id,
    term: row.term,
    explanation: row.explanation,
    sourceIds: row.kinship_rule_sources?.map((link) => link.source_id) ?? [],
    status: row.status,
    caution: row.caution ?? undefined,
  }));
}

export async function listRelationshipEdges(): Promise<RelationshipEdge[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return pilotRelationshipEdges;

  const { data, error } = await supabase
    .from("relationships")
    .select("id,relationship_type,status,context_note,relationship_sources(source_id),source:entities!relationships_source_entity_id_fkey(slug,status),target:entities!relationships_target_entity_id_fkey(slug,status)")
    .neq("status", "draft");

  if (error || !data?.length) return pilotRelationshipEdges;

  return (data as unknown as Array<{
    id: string;
    relationship_type: string;
    status: RelationshipEdge["status"];
    context_note: string | null;
    source: { slug: string; status: string };
    target: { slug: string; status: string };
    relationship_sources?: { source_id: string }[];
  }>)
    .filter((row) => row.source.status === "published" && row.target.status === "published")
    .map((row) => ({
      id: row.id,
      sourceSlug: row.source.slug,
      targetSlug: row.target.slug,
      relationshipType: row.relationship_type,
      label: row.relationship_type.replaceAll("_", " "),
      status: row.status,
      sourceIds: row.relationship_sources?.map((link) => link.source_id) ?? [],
      contextNote: row.context_note ?? undefined,
    }));
}
