import { describe, expect, it } from "vitest";
import { getPilotEntity, pilotEntities } from "@/lib/pilot-data";
import { resolveRelated } from "@/lib/related";

describe("resolveRelated", () => {
  it("mengikuti explicit related slugs", () => {
    const entity = getPilotEntity("ginting");
    expect(entity).toBeTruthy();
    const related = resolveRelated(entity!, pilotEntities);
    expect(related.map((item) => item.slug)).toContain("karo");
  });
});
