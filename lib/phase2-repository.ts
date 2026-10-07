import { calculateLocalCompleteness } from "@/lib/completeness";
import {
  pilotDictionaryEntries,
  pilotMapLocations,
  pilotMediaAssets,
  pilotTimelineSteps,
} from "@/lib/phase2-data";
import { listPublishedEntities } from "@/lib/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CompletenessRow,
  DictionaryEntry,
  MapLocation,
  MediaAssetRecord,
  TimelineStep,
} from "@/lib/types";

export async function listMapLocations(): Promise<MapLocation[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return pilotMapLocations;

  const { data, error } = await supabase
    .from("map_locations")
    .select("id,latitude,longitude,precision,note,entities!inner(slug,title,type,status)")
    .eq("status", "published")
    .eq("entities.status", "published")
    .order("created_at");

  if (error || !data?.length) return pilotMapLocations;

  return (data as unknown as Array<{
    id: string;
    latitude: number;
    longitude: number;
    precision: MapLocation["precision"];
    note: string;
    entities: {
      slug: string;
      title: string;
      type: MapLocation["entityType"];
      status: string;
    };
  }>).map((row) => ({
    id: row.id,
    entitySlug: row.entities.slug,
    title: row.entities.title,
    entityType: row.entities.type,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    precision: row.precision,
    note: row.note,
    culturalGroup: row.entities.type === "cultural_group" ? row.entities.title : undefined,
  }));
}

export async function listTimelineSteps(
  traditionSlug?: string,
): Promise<TimelineStep[]> {
  const fallback = traditionSlug
    ? pilotTimelineSteps.filter((step) => step.traditionSlug === traditionSlug)
    : pilotTimelineSteps;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  let query = supabase
    .from("tradition_timeline_steps")
    .select(
      "id,position,title,description,step_type,variation_note,traditions!inner(entities!inner(slug,status))",
    )
    .eq("status", "published")
    .eq("traditions.entities.status", "published")
    .order("position");

  if (traditionSlug) {
    query = query.eq("traditions.entities.slug", traditionSlug);
  }

  const { data, error } = await query;
  if (error || !data?.length) return fallback;

  return (data as unknown as Array<{
    id: string;
    position: number;
    title: string;
    description: string;
    step_type: TimelineStep["stepType"];
    variation_note: string | null;
    traditions: { entities: { slug: string; status: string } };
  }>).map((row) => ({
    id: row.id,
    traditionSlug: row.traditions.entities.slug,
    position: row.position,
    title: row.title,
    description: row.description,
    stepType: row.step_type,
    variationNote: row.variation_note ?? undefined,
  }));
}

export async function listDictionaryEntries(options?: {
  q?: string;
  language?: string;
}): Promise<DictionaryEntry[]> {
  const needle = options?.q?.trim().toLocaleLowerCase("id-ID") ?? "";
  const fallback = pilotDictionaryEntries.filter((entry) => {
    if (options?.language && entry.languageSlug !== options.language) return false;
    if (!needle) return true;
    return (
      entry.headword.toLocaleLowerCase("id-ID").includes(needle) ||
      entry.definitionId.toLocaleLowerCase("id-ID").includes(needle)
    );
  });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  let query = supabase
    .from("dictionary_entries")
    .select(
      "id,headword,definition_id,part_of_speech,pronunciation,usage_note,status,language_varieties!inner(entities!inner(slug,title,status))",
    )
    .eq("status", "published")
    .eq("language_varieties.entities.status", "published")
    .order("headword");

  if (options?.language) {
    query = query.eq("language_varieties.entities.slug", options.language);
  }
  if (needle) {
    query = query.or(`headword.ilike.%${needle}%,definition_id.ilike.%${needle}%`);
  }

  const { data, error } = await query;
  if (error || !data?.length) return fallback;

  return (data as unknown as Array<{
    id: string;
    headword: string;
    definition_id: string;
    part_of_speech: string | null;
    pronunciation: string | null;
    usage_note: string | null;
    status: string;
    language_varieties: { entities: { slug: string; title: string; status: string } };
  }>).map((row) => ({
    id: row.id,
    headword: row.headword,
    languageSlug: row.language_varieties.entities.slug,
    languageLabel: row.language_varieties.entities.title.replace(/^Bahasa\s+/i, ""),
    definitionId: row.definition_id,
    partOfSpeech: row.part_of_speech ?? undefined,
    pronunciation: row.pronunciation ?? undefined,
    usageNote: row.usage_note ?? undefined,
    sourceIds: [],
    status: "published",
  }));
}

export async function listMediaAssets(
  entitySlug?: string,
): Promise<MediaAssetRecord[]> {
  const fallback = pilotMediaAssets.filter(
    (item) => !entitySlug || item.entitySlug === entitySlug,
  );
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  let query = supabase
    .from("media_assets")
    .select(
      "id,title,media_type,storage_path,external_url,alt_text,caption,creator,rights_holder,license,license_url,attribution_text,rights_status,usage_note,status,entities(slug)",
    )
    .eq("status", "published")
    .order("created_at");

  if (entitySlug) query = query.eq("entities.slug", entitySlug);

  const { data, error } = await query;
  if (error || !data?.length) return fallback;

  return (data as unknown as Array<{
    id: string;
    title: string | null;
    media_type: MediaAssetRecord["mediaType"];
    storage_path: string | null;
    external_url: string | null;
    alt_text: string;
    caption: string | null;
    creator: string | null;
    rights_holder: string | null;
    license: string | null;
    license_url: string | null;
    attribution_text: string | null;
    rights_status: MediaAssetRecord["rightsStatus"];
    usage_note: string | null;
    status: string;
    entities: { slug: string } | null;
  }>).map((row) => ({
    id: row.id,
    entitySlug: row.entities?.slug,
    title: row.title ?? "Media asset",
    mediaType: row.media_type,
    previewUrl: row.storage_path ?? undefined,
    externalUrl: row.external_url ?? undefined,
    altText: row.alt_text,
    caption: row.caption ?? undefined,
    creator: row.creator ?? undefined,
    rightsHolder: row.rights_holder ?? undefined,
    license: row.license ?? undefined,
    licenseUrl: row.license_url ?? undefined,
    attributionText: row.attribution_text ?? undefined,
    rightsStatus: row.rights_status,
    usageNote: row.usage_note ?? undefined,
    status: "published",
  }));
}

export async function listCompletenessRows(): Promise<CompletenessRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return calculateLocalCompleteness(await listPublishedEntities());

  const { data, error } = await supabase
    .from("content_completeness")
    .select(
      "entity_slug,title,type,score,has_summary,has_sections,has_sources,has_relationships,has_media,has_interactive_data,missing",
    )
    .order("score", { ascending: true });

  if (error || !data?.length) {
    return calculateLocalCompleteness(await listPublishedEntities());
  }

  return (data as unknown as Array<{
    entity_slug: string;
    title: string;
    type: CompletenessRow["type"];
    score: number;
    has_summary: boolean;
    has_sections: boolean;
    has_sources: boolean;
    has_relationships: boolean;
    has_media: boolean;
    has_interactive_data: boolean;
    missing: string[] | null;
  }>).map((row) => ({
    entitySlug: row.entity_slug,
    title: row.title,
    type: row.type,
    score: Number(row.score),
    summary: row.has_summary,
    sections: row.has_sections,
    sources: row.has_sources,
    relationships: row.has_relationships,
    media: row.has_media,
    interactiveData: row.has_interactive_data,
    missing: row.missing ?? [],
  }));
}
