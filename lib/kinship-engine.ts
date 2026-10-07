import type { KinshipInference, KinshipRule } from "@/lib/types";

export function inferKinshipTerm(
  culturalContext: KinshipRule["culturalContext"],
  relationCode: string,
  rules: KinshipRule[],
): KinshipInference {
  const matches = rules.filter(
    (rule) =>
      rule.culturalContext === culturalContext &&
      rule.relationCode === relationCode &&
      rule.status !== "draft" &&
      rule.status !== "disputed",
  );

  if (!matches.length) {
    return {
      status: "unknown",
      explanation:
        "Belum ada rule terverifikasi yang cukup untuk menentukan istilah ini. Sistem sengaja tidak menebak dari marga saja.",
      ruleIds: [],
      sourceIds: [],
    };
  }

  const terms = [...new Set(matches.map((rule) => rule.term))];
  if (terms.length > 1) {
    return {
      status: "ambiguous",
      explanation:
        "Lebih dari satu istilah terdokumentasi untuk kondisi ini. Perlu konteks keluarga/wilayah tambahan sebelum menentukan sapaan.",
      ruleIds: matches.map((rule) => rule.id),
      sourceIds: [...new Set(matches.flatMap((rule) => rule.sourceIds))],
    };
  }

  return {
    status: "matched",
    term: terms[0],
    explanation: matches[0].explanation,
    ruleIds: matches.map((rule) => rule.id),
    sourceIds: [...new Set(matches.flatMap((rule) => rule.sourceIds))],
  };
}
