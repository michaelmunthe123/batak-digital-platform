import { describe, expect, it } from "vitest";
import { pilotEntities } from "@/lib/pilot-data";
import { searchLocalEntities } from "@/lib/search-core";

describe("Phase 2 search filters", () => {
  it("filters by entity type", () => {
    const results = searchLocalEntities("", pilotEntities, { types: ["language_variety"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.type === "language_variety")).toBe(true);
  });

  it("can require source-backed entities", () => {
    const results = searchLocalEntities("", pilotEntities, { sourceBackedOnly: true });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.sourceBacked)).toBe(true);
  });
});
