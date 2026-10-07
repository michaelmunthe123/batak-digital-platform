import { pilotDictionaryEntries, pilotMapLocations, pilotMediaAssets, pilotTimelineSteps } from "@/lib/phase2-data";
import type { CompletenessRow, KnowledgeEntity } from "@/lib/types";

function hasInteractiveData(entity: KnowledgeEntity) {
  if (entity.type === "cultural_group" || entity.type === "region") {
    return pilotMapLocations.some((item) => item.entitySlug === entity.slug);
  }
  if (entity.type === "tradition") {
    return pilotTimelineSteps.some((item) => item.traditionSlug === entity.slug);
  }
  if (entity.type === "language_variety") {
    return pilotDictionaryEntries.some((item) => item.languageSlug === entity.slug);
  }
  return false;
}

export function calculateLocalCompleteness(
  entities: KnowledgeEntity[],
): CompletenessRow[] {
  return entities.map((entity) => {
    const summary = entity.summary.trim().length >= 40;
    const sections = Boolean(entity.sections?.length);
    const sources = Boolean(entity.sourceIds?.length);
    const relationships = Boolean(entity.relatedSlugs?.length);
    const media = pilotMediaAssets.some((item) => item.entitySlug === entity.slug);
    const interactiveData = hasInteractiveData(entity);

    const checks = [summary, sections, sources, relationships, media, interactiveData];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const missing: string[] = [];
    if (!summary) missing.push("ringkasan memadai");
    if (!sections) missing.push("content section");
    if (!sources) missing.push("sumber");
    if (!relationships) missing.push("related content");
    if (!media) missing.push("media + rights metadata");
    if (!interactiveData) missing.push("data interaktif sesuai tipe");

    return {
      entitySlug: entity.slug,
      title: entity.title,
      type: entity.type,
      score,
      summary,
      sections,
      sources,
      relationships,
      media,
      interactiveData,
      missing,
    };
  });
}
