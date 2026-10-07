import { describe, expect, it } from "vitest";
import { pilotEntities } from "@/lib/pilot-data";
import { searchLocalEntities } from "@/lib/search-core";

describe("searchLocalEntities", () => {
  it("memprioritaskan exact title match", () => {
    const results = searchLocalEntities("Munthe", pilotEntities);
    expect(results[0]?.slug).toBe("munthe");
  });

  it("mendukung alias/ejaan alternatif", () => {
    const results = searchLocalEntities("Munte", pilotEntities);
    expect(results.some((item) => item.slug === "munthe")).toBe(true);
  });

  it("mengembalikan array kosong untuk query kosong", () => {
    expect(searchLocalEntities("   ", pilotEntities)).toEqual([]);
  });
});
