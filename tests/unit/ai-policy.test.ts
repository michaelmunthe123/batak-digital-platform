import { describe, expect, it } from "vitest";
import { sanitizeInlineSourceCitations, selectCitedDocuments, validateSourceKeys } from "@/lib/ai-policy";
import type { AIRetrievedDocument } from "@/lib/ai-types";

const docs: AIRetrievedDocument[] = [
  {
    id: "1",
    documentKey: "claim:1",
    documentType: "claim",
    title: "Claim A",
    content: "A",
    sourceId: "source-a",
    sourceTitle: "Source A",
    score: 1,
    sourceKey: "S1",
  },
  {
    id: "2",
    documentKey: "claim:2",
    documentType: "claim",
    title: "Claim B",
    content: "B",
    sourceId: "source-b",
    sourceTitle: "Source B",
    score: 0.8,
    sourceKey: "S2",
  },
];

describe("AI grounding policy", () => {
  it("drops hallucinated citation keys", () => {
    expect(validateSourceKeys(["S1", "S99", "S1"], docs)).toEqual(["S1"]);
  });

  it("returns only cited source documents", () => {
    expect(selectCitedDocuments(["S2"], docs).map((doc) => doc.id)).toEqual(["2"]);
  });

  it("removes hallucinated inline citation labels", () => {
    expect(sanitizeInlineSourceCitations("Didukung [S1], bukan [S99].", docs)).toBe(
      "Didukung [S1], bukan .",
    );
  });
});
