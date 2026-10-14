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

  it("menampilkan direktori untuk query kosong tanpa mengarang entri", () => {
    const results = searchLocalEntities("   ", pilotEntities);
    expect(results.map((item) => item.slug).sort()).toEqual(pilotEntities.map((item) => item.slug).sort());
    expect(searchLocalEntities("   ", [])).toEqual([]);
  });
});
