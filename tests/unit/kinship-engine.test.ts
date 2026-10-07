import { describe, expect, it } from "vitest";
import { inferKinshipTerm } from "@/lib/kinship-engine";
import { pilotKinshipRules } from "@/lib/phase3-data";

describe("kinship rule engine", () => {
  it("returns a sourced Toba rule when relation is explicit", () => {
    const result = inferKinshipTerm("toba", "mothers_brother", pilotKinshipRules);
    expect(result.status).toBe("matched");
    expect(result.term).toBe("tulang");
    expect(result.sourceIds).toContain("tata-kelakuan-sumut");
  });

  it("fails closed for an unknown relationship", () => {
    const result = inferKinshipTerm("toba", "same_clan_guess", pilotKinshipRules);
    expect(result.status).toBe("unknown");
    expect(result.term).toBeUndefined();
  });
});
