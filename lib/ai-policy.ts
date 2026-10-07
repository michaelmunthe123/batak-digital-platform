import type { AIRetrievedDocument } from "@/lib/ai-types";

export function validateSourceKeys(
  keys: string[],
  documents: AIRetrievedDocument[],
) {
  const allowed = new Set(documents.map((doc) => doc.sourceKey).filter(Boolean));
  return [...new Set(keys)].filter((key) => allowed.has(key));
}

export function sanitizeInlineSourceCitations(
  text: string,
  documents: AIRetrievedDocument[],
) {
  const allowed = new Set(documents.map((doc) => doc.sourceKey).filter(Boolean));
  return text.replace(/\[(S\d+)\]/g, (match, key: string) =>
    allowed.has(key) ? match : "",
  );
}

export function selectCitedDocuments(
  keys: string[],
  documents: AIRetrievedDocument[],
) {
  const valid = new Set(validateSourceKeys(keys, documents));
  return documents.filter((doc) => valid.has(doc.sourceKey ?? ""));
}

export function isHighRiskModerationCategory(category: string) {
  return new Set([
    "sexual/minors",
    "self-harm/instructions",
    "hate/threatening",
    "harassment/threatening",
    "illicit/violent",
  ]).has(category);
}
