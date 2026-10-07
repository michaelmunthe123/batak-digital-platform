import { getPilotEntity, pilotEntities, pilotSources } from "@/lib/pilot-data";
import { searchLocalEntities } from "@/lib/search-core";
import type { KnowledgeEntity, SearchFilters, SearchResult, SourceRecord } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DbEntityRow = {
  id: string;
  slug: string;
  type: KnowledgeEntity["type"];
  title: string;
  summary: string | null;
};

function mapEntity(row: DbEntityRow): KnowledgeEntity {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    summary: row.summary ?? "",
  };
}

export async function listPublishedEntities(): Promise<KnowledgeEntity[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return pilotEntities;

  const { data, error } = await supabase
    .from("entities")
    .select("id,slug,type,title,summary")
    .eq("status", "published")
    .order("title");

  if (error || !data?.length) return pilotEntities;
  return (data as DbEntityRow[]).map(mapEntity);
}

export async function getPublishedEntity(
  slug: string,
): Promise<KnowledgeEntity | undefined> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return getPilotEntity(slug);

  const { data, error } = await supabase
    .from("entities")
    .select(
      "id,slug,type,title,summary,content_sections(heading,body,position),entity_aliases(alias)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return getPilotEntity(slug);

  const row = data as unknown as {
    id: string;
    slug: string;
    type: KnowledgeEntity["type"];
    title: string;
    summary: string | null;
    content_sections?: { heading: string; body: string; position: number }[];
    entity_aliases?: { alias: string }[];
  };

  const pilot = getPilotEntity(slug);

  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    summary: row.summary ?? "",
    aliases: row.entity_aliases?.map((item) => item.alias) ?? pilot?.aliases ?? [],
    culturalGroup: pilot?.culturalGroup,
    localTerm: pilot?.localTerm,
    sourceIds: pilot?.sourceIds,
    relatedSlugs: pilot?.relatedSlugs,
    editorialNote: pilot?.editorialNote,
    sections:
      row.content_sections
        ?.sort((a, b) => a.position - b.position)
        .map(({ heading, body }) => ({ heading, body })) ??
      pilot?.sections ??
      [],
  };
}

export async function listPublishedSources(): Promise<SourceRecord[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return pilotSources;

  const { data, error } = await supabase
    .from("sources")
    .select("id,title,creator,publisher,year,url,level,type,description,status")
    .eq("status", "published")
    .order("title");

  if (error || !data?.length) return pilotSources;
  return data as SourceRecord[];
}

export async function listSourcesForEntity(
  entity: KnowledgeEntity,
): Promise<SourceRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase || !entity.id) {
    return pilotSources.filter((source) => entity.sourceIds?.includes(source.id));
  }

  const [{ data: directLinks }, { data: claims }] = await Promise.all([
    supabase.from("entity_sources").select("source_id").eq("entity_id", entity.id),
    supabase.from("claims").select("id").eq("entity_id", entity.id).neq("status", "draft"),
  ]);

  const claimIds = (claims ?? []).map((claim: { id: string }) => claim.id);
  const { data: claimLinks } = claimIds.length
    ? await supabase.from("claim_sources").select("source_id").in("claim_id", claimIds)
    : { data: [] as { source_id: string }[] };

  const sourceIds = [
    ...new Set([
      ...(directLinks ?? []).map((link: { source_id: string }) => link.source_id),
      ...(claimLinks ?? []).map((link: { source_id: string }) => link.source_id),
    ]),
  ];
  if (!sourceIds.length) {
    return pilotSources.filter((source) => entity.sourceIds?.includes(source.id));
  }

  const { data: sources, error } = await supabase
    .from("sources")
    .select("id,title,creator,publisher,year,url,level,type,description,status")
    .in("id", sourceIds)
    .eq("status", "published")
    .order("title");

  if (error || !sources?.length) {
    return pilotSources.filter((source) => entity.sourceIds?.includes(source.id));
  }

  return sources as SourceRecord[];
}

export async function listRelatedEntities(
  entity: KnowledgeEntity,
): Promise<KnowledgeEntity[]> {
  const supabase = await createSupabaseServerClient();

  const fallback = pilotEntities.filter((candidate) =>
    new Set(entity.relatedSlugs ?? []).has(candidate.slug),
  );

  if (!supabase || !entity.id) return fallback;

  const { data: relationships, error } = await supabase
    .from("relationships")
    .select("source_entity_id,target_entity_id")
    .or(`source_entity_id.eq.${entity.id},target_entity_id.eq.${entity.id}`)
    .neq("status", "draft");

  if (error || !relationships?.length) return fallback;

  const ids = [
    ...new Set(
      relationships.map((relation: { source_entity_id: string; target_entity_id: string }) =>
        relation.source_entity_id === entity.id
          ? (relation.target_entity_id as string)
          : (relation.source_entity_id as string),
      ),
    ),
  ];

  const { data: entities, error: entityError } = await supabase
    .from("entities")
    .select("id,slug,type,title,summary")
    .in("id", ids)
    .eq("status", "published");

  if (entityError || !entities?.length) return fallback;
  return (entities as DbEntityRow[]).map(mapEntity);
}

export async function searchKnowledge(
  query: string,
  filters: SearchFilters = {},
): Promise<SearchResult[]> {
  const supabase = await createSupabaseServerClient();

  if (supabase && (query.trim() || filters.types?.length || filters.sourceBackedOnly)) {
    const { data, error } = await supabase.rpc("search_knowledge_v2", {
      search_query: query,
      type_filters: filters.types?.length ? filters.types : null,
      source_backed_only: filters.sourceBackedOnly ?? false,
    });

    if (!error && data?.length) {
      return (data as Array<{
        slug: string;
        title: string;
        type: KnowledgeEntity["type"];
        summary: string;
        score: number;
      }>).map((row) => ({
        ...row,
        href: row.type === "clan" ? `/marga/${row.slug}` : `/knowledge/${row.slug}`,
        sourceBacked: filters.sourceBackedOnly ? true : undefined,
      }));
    }
  }

  return searchLocalEntities(query, pilotEntities, filters);
}
