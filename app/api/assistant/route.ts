import { getAIConfig, isAIConfigured } from "@/lib/ai-config";
import {
  consumeAIRateLimit,
  logAIRequest,
  retrieveAIContext,
} from "@/lib/ai-repository";
import { deriveAnonymousKey } from "@/lib/ai-security";
import { generateGroundedAssistantAnswer } from "@/lib/ai-grounding";
import { moderateText } from "@/lib/openai-rest";
import type { AILanguage } from "@/lib/ai-types";

export const runtime = "nodejs";

function safeLanguage(value: unknown): AILanguage {
  return value === "en" ? "en" : "id";
}

export async function POST(request: Request) {
  const started = Date.now();
  let body: { question?: unknown; language?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const language = safeLanguage(body.language);
  if (question.length < 3 || question.length > 1500) {
    return Response.json(
      { error: "Pertanyaan harus berisi 3–1500 karakter." },
      { status: 400 },
    );
  }

  if (!isAIConfigured()) {
    return Response.json(
      {
        answer:
          language === "en"
            ? "The AI assistant is not configured on this deployment yet."
            : "AI assistant belum dikonfigurasi pada deployment ini.",
        confidence: "insufficient",
        caution:
          language === "en"
            ? "Configure OpenAI and index the published knowledge base first."
            : "Konfigurasikan OpenAI dan indeks knowledge base yang sudah dipublikasikan terlebih dahulu.",
        sources: [],
        retrievalMode: "unavailable",
      },
      { status: 503 },
    );
  }

  const anonymousKeyHash = deriveAnonymousKey(request);
  const allowed = await consumeAIRateLimit(anonymousKeyHash);
  if (!allowed) {
    return Response.json(
      { error: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." },
      { status: 429 },
    );
  }

  const moderation = await moderateText(question);
  if (moderation.highRisk) {
    const requestId = await logAIRequest({
      requestKind: "assistant",
      anonymousKeyHash,
      prompt: question,
      groundedStatus: "blocked",
      latencyMs: Date.now() - started,
      metadata: { moderation_categories: moderation.categories },
    });
    return Response.json({
      requestId,
      answer:
        language === "en"
          ? "I can help with cultural and educational questions, but I cannot continue with this request in its current form."
          : "Saya dapat membantu pertanyaan budaya dan edukasi, tetapi tidak dapat melanjutkan permintaan ini dalam bentuk sekarang.",
      confidence: "blocked",
      caution: "Safety filter applied.",
      sources: [],
      retrievalMode: "hybrid",
    });
  }

  try {
    const config = getAIConfig();
    const documents = await retrieveAIContext(question, {
      count: config.maxContextDocs,
    });
    const generated = await generateGroundedAssistantAnswer({
      question,
      language,
      documents,
      safetyIdentifier: anonymousKeyHash,
    });
    const selectedSources = generated.result.sourceKeys.length
      ? documents.filter((doc) =>
          generated.result.sourceKeys.includes(doc.sourceKey ?? ""),
        )
      : generated.result.confidence === "insufficient"
        ? []
        : documents.slice(0, 3);

    const requestId = await logAIRequest({
      requestKind: "assistant",
      anonymousKeyHash,
      prompt: question,
      model: generated.model === "none" ? undefined : generated.model,
      answer: generated.result.answer,
      documents,
      groundedStatus: generated.result.confidence,
      usage: generated.usage,
      latencyMs: Date.now() - started,
      metadata: {
        selected_source_keys: generated.result.sourceKeys,
        moderation_categories: moderation.categories,
      },
    });

    return Response.json({
      requestId,
      answer: generated.result.answer,
      confidence: generated.result.confidence,
      caution: generated.result.caution,
      sources: selectedSources,
      model: generated.model === "none" ? undefined : generated.model,
      retrievalMode: "hybrid",
    });
  } catch (error) {
    await logAIRequest({
      requestKind: "assistant",
      anonymousKeyHash,
      prompt: question,
      groundedStatus: "error",
      latencyMs: Date.now() - started,
      metadata: { error: error instanceof Error ? error.message : "unknown" },
    });
    return Response.json(
      { error: "AI assistant sedang tidak dapat memproses pertanyaan ini." },
      { status: 500 },
    );
  }
}
