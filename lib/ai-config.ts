const DEFAULT_MODEL = "gpt-5.6-terra";
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_EMBEDDING_DIMENSIONS = 512;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAIConfig() {
  return {
    enabled: process.env.AI_ENABLED !== "false",
    openAIKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    embeddingModel:
      process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL,
    embeddingDimensions: parsePositiveInteger(
      process.env.OPENAI_EMBEDDING_DIMENSIONS,
      DEFAULT_EMBEDDING_DIMENSIONS,
    ),
    maxContextDocs: Math.min(
      parsePositiveInteger(process.env.AI_MAX_CONTEXT_DOCS, 8),
      12,
    ),
    rateLimitPerWindow: Math.min(
      parsePositiveInteger(process.env.AI_RATE_LIMIT_PER_10_MIN, 20),
      100,
    ),
    storePrompts: process.env.AI_STORE_PROMPTS === "true",
    safetyHashSalt: process.env.AI_SAFETY_HASH_SALT,
  };
}

export function isAIConfigured() {
  const config = getAIConfig();
  return Boolean(
    config.enabled &&
      config.openAIKey &&
      config.safetyHashSalt &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}
