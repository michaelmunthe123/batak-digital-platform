import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAIConfig, isAIConfigured } from "@/lib/ai-config";
import { createEmbedding } from "@/lib/openai-rest";
import type {
  AIGroundedStatus,
  AIRetrievedDocument,
  AIUsage,
} from "@/lib/ai-types";

function requireAdminClient() {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase server secret belum dikonfigurasi.");
  return client;
}

export async function consumeAIRateLimit(keyHash: string) {
  if (!isAIConfigured()) return false;
  const supabase = requireAdminClient();
  const config = getAIConfig();
  const { data, error } = await supabase.rpc("consume_ai_rate_limit", {
    target_key_hash: keyHash,
    request_limit: config.rateLimitPerWindow,
    window_minutes: 10,
  });
  if (error) throw new Error(`Rate limit check gagal: ${error.message}`);
  return Boolean(data);
}

export async function retrieveAIContext(
  query: string,
  options: { count?: number; documentTypes?: string[] } = {},
): Promise<AIRetrievedDocument[]> {
  if (!isAIConfigured()) return [];
  const supabase = requireAdminClient();
  const embedding = await createEmbedding(query);
  const config = getAIConfig();
  const count = Math.min(options.count ?? config.maxContextDocs, 12);

  const { data, error } = await supabase.rpc("hybrid_search_ai", {
    query_text: query,
    query_embedding: embedding,
    match_count: count,
    document_types: options.documentTypes?.length ? options.documentTypes : null,
  });

  if (error) throw new Error(`Hybrid retrieval gagal: ${error.message}`);

  return ((data ?? []) as Array<Record<string, unknown>>).map((row, index) => ({
    id: String(row.id),
    documentKey: String(row.document_key),
    documentType: String(row.document_type) as AIRetrievedDocument["documentType"],
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    entityId: row.entity_id ? String(row.entity_id) : undefined,
    entitySlug: row.entity_slug ? String(row.entity_slug) : undefined,
    entityType: row.entity_type ? String(row.entity_type) : undefined,
    sourceId: String(row.source_id),
    sourceTitle: String(row.source_title ?? "Sumber"),
    sourceUrl: row.source_url ? String(row.source_url) : undefined,
    citationLocator: row.citation_locator ? String(row.citation_locator) : undefined,
    claimStatus: row.claim_status ? String(row.claim_status) : undefined,
    culturalContext: row.cultural_context ? String(row.cultural_context) : undefined,
    score: Number(row.score ?? 0),
    sourceKey: `S${index + 1}`,
  }));
}

export async function logAIRequest(input: {
  requestKind: "assistant" | "semantic_search" | "learning_plan" | "editorial_review";
  actorId?: string;
  anonymousKeyHash?: string;
  prompt: string;
  model?: string;
  answer?: string;
  documents?: AIRetrievedDocument[];
  groundedStatus: AIGroundedStatus;
  usage?: AIUsage;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return undefined;
  const config = getAIConfig();
  const { createHash } = await import("node:crypto");
  const promptHash = createHash("sha256").update(input.prompt).digest("hex");

  const { data, error } = await supabase
    .from("ai_request_log")
    .insert({
      request_kind: input.requestKind,
      actor_id: input.actorId ?? null,
      anonymous_key_hash: input.anonymousKeyHash ?? null,
      prompt_text: config.storePrompts ? input.prompt : null,
      prompt_hash: promptHash,
      model: input.model ?? null,
      embedding_model: config.embeddingModel,
      answer_text: config.storePrompts ? input.answer ?? null : null,
      retrieved_document_ids: input.documents?.map((doc) => doc.id) ?? [],
      grounded_status: input.groundedStatus,
      input_tokens: input.usage?.inputTokens ?? null,
      output_tokens: input.usage?.outputTokens ?? null,
      total_tokens: input.usage?.totalTokens ?? null,
      latency_ms: input.latencyMs ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) return undefined;
  return data?.id as string | undefined;
}

export async function saveAIFeedback(input: {
  requestId: string;
  actorId?: string;
  rating: -1 | 1;
  reason?: string;
  comment?: string;
}) {
  const supabase = requireAdminClient();
  const { error } = await supabase.from("ai_feedback").upsert(
    {
      request_id: input.requestId,
      actor_id: input.actorId ?? null,
      rating: input.rating,
      reason: input.reason ?? null,
      comment: input.comment?.slice(0, 1000) ?? null,
    },
    { onConflict: "request_id,actor_id" },
  );
  if (error) throw new Error(`Feedback gagal disimpan: ${error.message}`);
}

export async function saveEditorialAIReview(input: {
  requestId?: string;
  actorId: string;
  targetType?: string;
  targetId?: string;
  snapshotHash: string;
  excerpt: string;
  documentIds: string[];
  output: Record<string, unknown>;
  model: string;
}) {
  const supabase = requireAdminClient();
  const { data, error } = await supabase
    .from("ai_editorial_reviews")
    .insert({
      request_id: input.requestId ?? null,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      input_snapshot_hash: input.snapshotHash,
      input_excerpt: input.excerpt,
      retrieved_document_ids: input.documentIds,
      output: input.output,
      model: input.model,
      created_by: input.actorId,
    })
    .select("id")
    .single();
  if (error) throw new Error(`AI editorial review gagal disimpan: ${error.message}`);
  return data?.id as string;
}

export async function getAISystemStatus() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      configured: false,
      publishedDocuments: 0,
      embeddedDocuments: 0,
      requests7d: 0,
      errors7d: 0,
      positiveFeedback30d: 0,
      negativeFeedback30d: 0,
    };
  }
  const { data } = await supabase.from("ai_system_status").select("*").maybeSingle();
  return {
    configured: isAIConfigured(),
    publishedDocuments: Number(data?.published_documents ?? 0),
    embeddedDocuments: Number(data?.embedded_documents ?? 0),
    requests7d: Number(data?.requests_7d ?? 0),
    errors7d: Number(data?.errors_7d ?? 0),
    positiveFeedback30d: Number(data?.positive_feedback_30d ?? 0),
    negativeFeedback30d: Number(data?.negative_feedback_30d ?? 0),
  };
}
