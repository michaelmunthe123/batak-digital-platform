import { getAIConfig, isAIConfigured } from "@/lib/ai-config";
import {
  consumeAIRateLimit,
  logAIRequest,
  retrieveAIContext,
} from "@/lib/ai-repository";
import { deriveAnonymousKey } from "@/lib/ai-security";
import { generateLearningPlan } from "@/lib/ai-grounding";
import type { AILanguage } from "@/lib/ai-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const started = Date.now();
  let body: { topics?: unknown; level?: unknown; language?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  const topics = Array.isArray(body.topics)
    ? body.topics.filter((value): value is string => typeof value === "string").slice(0, 5)
    : [];
  const level =
    body.level === "intermediate" || body.level === "advanced"
      ? body.level
      : "beginner";
  const language: AILanguage = body.language === "en" ? "en" : "id";
  if (!topics.length) {
    return Response.json({ error: "Pilih minimal satu topik." }, { status: 400 });
  }
  if (!isAIConfigured()) {
    return Response.json({ error: "AI belum dikonfigurasi." }, { status: 503 });
  }

  const anonymousKeyHash = deriveAnonymousKey(request);
  if (!(await consumeAIRateLimit(anonymousKeyHash))) {
    return Response.json({ error: "Rate limit tercapai." }, { status: 429 });
  }

  const query = `${topics.join(", ")} cultural learning ${level}`;
  try {
    const config = getAIConfig();
    const documents = await retrieveAIContext(query, {
      count: Math.max(config.maxContextDocs, 8),
    });
    const generated = await generateLearningPlan({
      topics,
      level,
      language,
      documents,
      safetyIdentifier: anonymousKeyHash,
    });
    const usedKeys = new Set(generated.data.steps.flatMap((step) => step.sourceKeys));
    const sources = documents.filter((doc) => usedKeys.has(doc.sourceKey ?? ""));
    const requestId = await logAIRequest({
      requestKind: "learning_plan",
      anonymousKeyHash,
      prompt: query,
      model: generated.model,
      answer: generated.data.overview,
      documents,
      groundedStatus: "grounded",
      usage: generated.usage,
      latencyMs: Date.now() - started,
      metadata: { topics, level, language },
    });
    return Response.json({ requestId, plan: generated.data, sources, model: generated.model });
  } catch (error) {
    await logAIRequest({
      requestKind: "learning_plan",
      anonymousKeyHash,
      prompt: query,
      groundedStatus: "error",
      latencyMs: Date.now() - started,
      metadata: { error: error instanceof Error ? error.message : "unknown" },
    });
    return Response.json({ error: "Learning plan tidak dapat dibuat." }, { status: 500 });
  }
}
