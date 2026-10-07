import { isAIConfigured } from "@/lib/ai-config";
import {
  consumeAIRateLimit,
  logAIRequest,
  retrieveAIContext,
} from "@/lib/ai-repository";
import { deriveAnonymousKey } from "@/lib/ai-security";
import { moderateText } from "@/lib/openai-rest";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const started = Date.now();
  let body: { query?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }
  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (query.length < 2 || query.length > 500) {
    return Response.json({ error: "Query harus berisi 2–500 karakter." }, { status: 400 });
  }
  if (!isAIConfigured()) {
    return Response.json(
      { query, results: [], retrievalMode: "unavailable" },
      { status: 503 },
    );
  }

  const anonymousKeyHash = deriveAnonymousKey(request);
  if (!(await consumeAIRateLimit(anonymousKeyHash))) {
    return Response.json({ error: "Rate limit tercapai." }, { status: 429 });
  }
  const moderation = await moderateText(query);
  if (moderation.highRisk) {
    return Response.json({ error: "Query tidak dapat diproses." }, { status: 400 });
  }

  try {
    const results = await retrieveAIContext(query, { count: 10 });
    const requestId = await logAIRequest({
      requestKind: "semantic_search",
      anonymousKeyHash,
      prompt: query,
      documents: results,
      groundedStatus: results.length ? "grounded" : "insufficient",
      latencyMs: Date.now() - started,
    });
    return Response.json({ requestId, query, results, retrievalMode: "hybrid" });
  } catch (error) {
    await logAIRequest({
      requestKind: "semantic_search",
      anonymousKeyHash,
      prompt: query,
      groundedStatus: "error",
      latencyMs: Date.now() - started,
      metadata: { error: error instanceof Error ? error.message : "unknown" },
    });
    return Response.json({ error: "Semantic search gagal." }, { status: 500 });
  }
}
