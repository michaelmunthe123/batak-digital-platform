import type { KnowledgeEntity } from "@/lib/types";

export function resolveRelated(
  entity: KnowledgeEntity,
  entities: KnowledgeEntity[],
) {
  const wanted = new Set(entity.relatedSlugs ?? []);
  return entities.filter((candidate) => wanted.has(candidate.slug));
}
