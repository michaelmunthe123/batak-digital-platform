import type { ContributionStatus } from "@/lib/community-types";

export type CommunityActorRole = "author" | "reviewer" | "editor" | "admin";

const authorTransitions: Partial<Record<ContributionStatus, ContributionStatus[]>> = {
  draft: ["submitted", "withdrawn"],
  submitted: ["withdrawn"],
  needs_evidence: ["submitted", "withdrawn"],
};

const moderatorTransitions: Partial<Record<ContributionStatus, ContributionStatus[]>> = {
  submitted: ["in_review", "needs_evidence", "rejected", "disputed"],
  needs_evidence: ["in_review", "rejected", "disputed"],
  in_review: ["needs_evidence", "accepted", "merged", "rejected", "disputed"],
  accepted: ["merged", "in_review"],
};

export function allowedContributionTransitions(
  role: CommunityActorRole,
  status: ContributionStatus,
): ContributionStatus[] {
  if (role === "author") return authorTransitions[status] ?? [];
  const values = moderatorTransitions[status] ?? [];
  if (role === "reviewer") return values.filter((value) => value !== "merged");
  return values;
}

export function canEditContribution(status: ContributionStatus) {
  return status === "draft" || status === "needs_evidence";
}

export function needsEvidenceSourceBeforeSubmit(type: string) {
  return ["correction", "relationship", "genealogy", "language"].includes(type);
}

export function contributionStatusLabel(status: ContributionStatus) {
  const labels: Record<ContributionStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    needs_evidence: "Needs evidence",
    in_review: "In review",
    accepted: "Accepted",
    merged: "Merged",
    rejected: "Rejected",
    disputed: "Disputed",
    withdrawn: "Withdrawn",
  };
  return labels[status];
}
