import { describe, expect, it } from "vitest";
import { findRelationshipPath } from "@/lib/relationship-engine";
import { pilotRelationshipEdges } from "@/lib/phase3-data";

describe("knowledge relationship engine", () => {
  it("finds a source-aware Karo path", () => {
    const result = findRelationshipPath("karo", "senina", pilotRelationshipEdges);
    expect(result.status).toBe("found");
    expect(result.edges).toHaveLength(2);
  });

  it("does not fabricate clan relations", () => {
    const result = findRelationshipPath("munthe", "simanjuntak", pilotRelationshipEdges);
    expect(result.status).toBe("not_found");
  });
});
