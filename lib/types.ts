export type EntityType =
  | "cultural_group"
  | "clan"
  | "region"
  | "tradition"
  | "kinship_system"
  | "kinship_term"
  | "language_variety"
  | "artifact"
  | "performance"
  | "textile"
  | "architecture"
  | "cuisine";

export type ClaimStatus =
  | "verified"
  | "supported"
  | "regional_variation"
  | "disputed"
  | "community_sourced"
  | "draft";

export type SourceLevel = "A" | "B" | "C" | "D";
export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type ContentSection = {
  heading: string;
  body: string;
};

export type KnowledgeEntity = {
  id?: string;
  slug: string;
  type: EntityType;
  title: string;
  summary: string;
  aliases?: string[];
  culturalGroup?: string;
  region?: string;
  localTerm?: string;
  sections?: ContentSection[];
  sourceIds?: string[];
  relatedSlugs?: string[];
  editorialNote?: string;
};

export type SourceRecord = {
  id: string;
  title: string;
  creator?: string;
  publisher?: string;
  year?: number;
  url?: string;
  level: SourceLevel;
  type:
    | "academic"
    | "institutional"
    | "oral_history"
    | "community"
    | "archive";
  description: string;
  status: "published" | "draft";
};

export type SearchResult = {
  slug: string;
  title: string;
  type: EntityType;
  summary: string;
  href: string;
  score: number;
  culturalGroup?: string;
  sourceBacked?: boolean;
};

export type SearchFilters = {
  types?: EntityType[];
  culturalGroup?: string;
  sourceBackedOnly?: boolean;
};

export type MapLocation = {
  id: string;
  entitySlug: string;
  title: string;
  entityType: EntityType;
  latitude: number;
  longitude: number;
  precision: "representative" | "place" | "approximate";
  culturalGroup?: string;
  note: string;
  sourceIds?: string[];
};

export type TimelineStep = {
  id: string;
  traditionSlug: string;
  position: number;
  title: string;
  description: string;
  stepType: "context" | "preparation" | "core" | "closing" | "variation";
  sourceIds?: string[];
  variationNote?: string;
};

export type DictionaryEntry = {
  id: string;
  headword: string;
  languageSlug: string;
  languageLabel: string;
  definitionId: string;
  partOfSpeech?: string;
  pronunciation?: string;
  usageNote?: string;
  sourceIds: string[];
  status: "published" | "draft";
};

export type MediaAssetRecord = {
  id: string;
  entitySlug?: string;
  title: string;
  mediaType: "image" | "audio" | "document" | "video";
  previewUrl?: string;
  externalUrl?: string;
  altText: string;
  caption?: string;
  creator?: string;
  rightsHolder?: string;
  license?: string;
  licenseUrl?: string;
  attributionText?: string;
  rightsStatus:
    | "cleared"
    | "public_domain"
    | "licensed"
    | "metadata_only"
    | "unknown";
  sourceId?: string;
  usageNote?: string;
  status: "published" | "draft";
};

export type CompletenessRow = {
  entitySlug: string;
  title: string;
  type: EntityType;
  score: number;
  summary: boolean;
  sections: boolean;
  sources: boolean;
  relationships: boolean;
  media: boolean;
  interactiveData: boolean;
  missing: string[];
};


export type GenealogyVisibility = "public" | "restricted" | "private";
export type GenealogyLivingStatus = "unknown" | "living" | "deceased";
export type GenealogyRelationType =
  | "parent"
  | "spouse"
  | "sibling"
  | "adoptive_parent"
  | "traditional_descent";

export type GenealogyDataset = {
  id: string;
  slug: string;
  title: string;
  description: string;
  culturalGroup?: string;
  visibility: GenealogyVisibility;
  methodologyNote: string;
  sourceIds: string[];
  isDemo?: boolean;
};

export type GenealogyNode = {
  id: string;
  datasetSlug: string;
  label: string;
  generation: number;
  clanSlug?: string;
  gender?: "male" | "female" | "unknown";
  livingStatus: GenealogyLivingStatus;
  visibility: GenealogyVisibility;
  note?: string;
};

export type GenealogyEdge = {
  id: string;
  datasetSlug: string;
  sourceNodeId: string;
  targetNodeId: string;
  relation: GenealogyRelationType;
  status: ClaimStatus;
  sourceIds: string[];
  contextNote?: string;
};

export type GenealogyGraph = {
  dataset: GenealogyDataset;
  nodes: GenealogyNode[];
  edges: GenealogyEdge[];
};

export type KinshipRule = {
  id: string;
  culturalContext: "toba" | "karo" | "simalungun" | "pakpak-dairi" | "angkola" | "mandailing";
  relationCode: string;
  relationLabelId: string;
  term: string;
  explanation: string;
  sourceIds: string[];
  status: ClaimStatus;
  caution?: string;
};

export type KinshipInference = {
  status: "matched" | "ambiguous" | "unknown";
  term?: string;
  explanation: string;
  ruleIds: string[];
  sourceIds: string[];
};

export type RelationshipEdge = {
  id: string;
  sourceSlug: string;
  targetSlug: string;
  relationshipType: string;
  label: string;
  status: ClaimStatus;
  sourceIds: string[];
  contextNote?: string;
};

export type RelationshipPath = {
  status: "found" | "not_found";
  fromSlug: string;
  toSlug: string;
  edges: RelationshipEdge[];
  note: string;
};
