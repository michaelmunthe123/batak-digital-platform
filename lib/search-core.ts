import type {
  KnowledgeEntity,
  SearchFilters,
  SearchResult,
} from "@/lib/types";

function normalize(value: string) {
  return value
    .toLocaleLowerCase("id-ID")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "");
}

export function hrefForEntity(entity: KnowledgeEntity) {
  if (entity.type === "clan") return `/marga/${entity.slug}`;
  return `/knowledge/${entity.slug}`;
}

export function entityMatchesFilters(
  entity: KnowledgeEntity,
  filters: SearchFilters = {},
) {
  if (filters.types?.length && !filters.types.includes(entity.type)) return false;

  if (
    filters.culturalGroup &&
    normalize(entity.culturalGroup ?? "") !== normalize(filters.culturalGroup)
  ) {
    return false;
  }

  if (filters.sourceBackedOnly && !(entity.sourceIds?.length ?? 0)) return false;
  return true;
}

export function searchLocalEntities(
  query: string,
  entities: KnowledgeEntity[],
  filters: SearchFilters = {},
): SearchResult[] {
  const needle = normalize(query.trim());

  return entities
    .filter((entity) => entityMatchesFilters(entity, filters))
    .map((entity) => {
      const title = normalize(entity.title);
      const aliases = (entity.aliases ?? []).map(normalize);
      const summary = normalize(entity.summary);
      const group = normalize(entity.culturalGroup ?? "");
      const sections = normalize(
        (entity.sections ?? []).map((section) => `${section.heading} ${section.body}`).join(" "),
      );

      let score = needle ? 0 : 1;
      if (needle) {
        if (title === needle) score += 100;
        if (title.startsWith(needle)) score += 50;
        if (title.includes(needle)) score += 30;
        if (aliases.some((alias) => alias === needle)) score += 80;
        if (aliases.some((alias) => alias.includes(needle))) score += 35;
        if (group.includes(needle)) score += 15;
        if (summary.includes(needle)) score += 10;
        if (sections.includes(needle)) score += 5;
      }

      return {
        slug: entity.slug,
        title: entity.title,
        type: entity.type,
        summary: entity.summary,
        href: hrefForEntity(entity),
        score,
        culturalGroup: entity.culturalGroup,
        sourceBacked: Boolean(entity.sourceIds?.length),
      } satisfies SearchResult;
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "id-ID"));
}
