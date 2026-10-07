export type CommunityMembershipStatus = "invited" | "active" | "suspended";

export type ContributionType =
  | "correction"
  | "source"
  | "new_content"
  | "relationship"
  | "genealogy"
  | "language"
  | "media";

export type ContributionStatus =
  | "draft"
  | "submitted"
  | "needs_evidence"
  | "in_review"
  | "accepted"
  | "merged"
  | "rejected"
  | "disputed"
  | "withdrawn";

export type ContributorProfile = {
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  interests: string[];
  isPublic: boolean;
};

export type ContributionRow = {
  id: string;
  authorId: string;
  type: ContributionType;
  targetEntityId?: string | null;
  targetEntityTitle?: string | null;
  title: string;
  sectionKey?: string | null;
  rationale: string;
  proposedContent: string;
  status: ContributionStatus;
  moderationNote?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  mergedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContributionSourceRow = {
  id: string;
  contributionId: string;
  sourceId?: string | null;
  sourceTitle?: string | null;
  proposedTitle?: string | null;
  proposedUrl?: string | null;
  locator?: string | null;
  note?: string | null;
  createdAt: string;
};

export type ContributionMessageRow = {
  id: string;
  contributionId: string;
  authorId: string;
  messageType: "comment" | "evidence_request" | "response" | "decision";
  body: string;
  isInternal: boolean;
  createdAt: string;
};

export type ContributionAuditRow = {
  id: number;
  contributionId: string;
  action: string;
  fromStatus?: ContributionStatus | null;
  toStatus?: ContributionStatus | null;
  detail: Record<string, unknown>;
  createdAt: string;
};

export type CommunityNotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href?: string | null;
  readAt?: string | null;
  createdAt: string;
};

export type ContributorStats = {
  submittedCount: number;
  acceptedCount: number;
  mergedCount: number;
  disputedCount: number;
  editorialScore: number;
};

export type ContentReportStatus = "open" | "triaged" | "resolved" | "dismissed";

export type ContentReportRow = {
  id: string;
  reporterId: string;
  entityId?: string | null;
  entityTitle?: string | null;
  urlPath?: string | null;
  category: "incorrect" | "missing_source" | "cultural_sensitivity" | "privacy" | "copyright" | "other";
  description: string;
  status: ContentReportStatus;
  resolutionNote?: string | null;
  createdAt: string;
  updatedAt: string;
};
