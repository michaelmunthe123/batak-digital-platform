import { describe, expect, it } from "vitest";
import {
  allowedContributionTransitions,
  canEditContribution,
  needsEvidenceSourceBeforeSubmit,
} from "@/lib/community-workflow";

describe("Phase 4 community workflow", () => {
  it("lets authors submit drafts and withdraw pre-review proposals", () => {
    expect(allowedContributionTransitions("author", "draft")).toEqual(["submitted", "withdrawn"]);
    expect(allowedContributionTransitions("author", "in_review")).toEqual([]);
  });

  it("prevents reviewer from merging but lets editor merge", () => {
    expect(allowedContributionTransitions("reviewer", "in_review")).not.toContain("merged");
    expect(allowedContributionTransitions("editor", "in_review")).toContain("merged");
  });

  it("only edits draft or needs-evidence state", () => {
    expect(canEditContribution("draft")).toBe(true);
    expect(canEditContribution("needs_evidence")).toBe(true);
    expect(canEditContribution("submitted")).toBe(false);
  });

  it("requires evidence for sensitive contribution types", () => {
    expect(needsEvidenceSourceBeforeSubmit("genealogy")).toBe(true);
    expect(needsEvidenceSourceBeforeSubmit("relationship")).toBe(true);
    expect(needsEvidenceSourceBeforeSubmit("new_content")).toBe(false);
  });
});
