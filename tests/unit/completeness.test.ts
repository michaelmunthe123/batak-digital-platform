import { describe, expect, it } from "vitest";
import { calculateLocalCompleteness } from "@/lib/completeness";
import { pilotEntities } from "@/lib/pilot-data";

describe("content completeness", () => {
  it("returns a bounded score for every entity", () => {
    const rows = calculateLocalCompleteness(pilotEntities);
    expect(rows).toHaveLength(pilotEntities.length);
    expect(rows.every((row) => row.score >= 0 && row.score <= 100)).toBe(true);
  });

  it("recognizes map data for cultural groups", () => {
    const row = calculateLocalCompleteness(pilotEntities).find((item) => item.entitySlug === "toba");
    expect(row?.interactiveData).toBe(true);
  });
});
