export type AILanguage = "id" | "en";
export type AIGroundedStatus =
  | "grounded"
  | "partial"
  | "insufficient"
  | "blocked"
  | "error";

export type AIRetrievedDocument = {
  id: string;
  documentKey: string;
  documentType:
    | "entity_summary"
    | "content_section"
    | "claim"
    | "relationship"
    | "timeline_step"
    | "dictionary_entry"
    | "kinship_rule";
  title: string;
  content: string;
  entityId?: string;
  entitySlug?: string;
  entityType?: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;
  citationLocator?: string;
  claimStatus?: string;
  culturalContext?: string;
  score: number;
  sourceKey?: string;
};

export type AssistantAnswer = {
  answer: string;
  confidence: "grounded" | "partial" | "insufficient";
  caution: string;
  sourceKeys: string[];
};

export type AssistantAPIResponse = {
  requestId?: string;
  answer: string;
  confidence: "grounded" | "partial" | "insufficient" | "blocked";
  caution: string;
  sources: AIRetrievedDocument[];
  model?: string;
  retrievalMode: "hybrid" | "unavailable";
};

export type SemanticSearchResponse = {
  requestId?: string;
  query: string;
  results: AIRetrievedDocument[];
  retrievalMode: "hybrid" | "unavailable";
};

export type LearningPlanStep = {
  title: string;
  objective: string;
  activity: string;
  sourceKeys: string[];
};

export type LearningPlanResult = {
  title: string;
  overview: string;
  steps: LearningPlanStep[];
  nextQuestion: string;
  caution: string;
};

export type EditorialAIReview = {
  summary: string;
  unsupportedClaims: string[];
  reviewerQuestions: string[];
  riskFlags: string[];
  sourceKeys: string[];
  recommendation: "continue_review" | "needs_evidence" | "high_risk";
};

export type AIUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type ModerationResult = {
  flagged: boolean;
  highRisk: boolean;
  categories: string[];
};
