import { getEditorialState } from "@/lib/auth/editor";
import { generateEditorialAIReview } from "@/lib/ai-grounding";
import {
  logAIRequest,
  retrieveAIContext,
  saveEditorialAIReview,
} from "@/lib/ai-repository";
import { hashText, safeExcerpt } from "@/lib/ai-security";
import { isAIConfigured } from "@/lib/ai-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const started = Date.now();
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized") {
    return Response.json({ error: "Tidak memiliki akses editorial." }, { status: 403 });
  }
  if (!isAIConfigured()) {
    return Response.json({ error: "AI belum dikonfigurasi." }, { status: 503 });
  }

  let body: {
    draft?: unknown;
    language?: unknown;
    targetType?: unknown;
    targetId?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  const draft = typeof body.draft === "string" ? body.draft.trim() : "";
  if (draft.length < 20 || draft.length > 10000) {
    return Response.json(
      { error: "Draft harus berisi 20–10.000 karakter." },
      { status: 400 },
    );
  }

  try {
    const documents = await retrieveAIContext(draft.slice(0, 1800), { count: 10 });
    const generated = await generateEditorialAIReview({
      draft,
      language: body.language === "en" ? "en" : "id",
      documents,
      safetyIdentifier: `editor-${editorial.userId}`,
    });
    const requestId = await logAIRequest({
      requestKind: "editorial_review",
      actorId: editorial.userId,
      prompt: draft,
      model: generated.model,
      answer: generated.data.summary,
      documents,
      groundedStatus: documents.length ? "grounded" : "partial",
      usage: generated.usage,
      latencyMs: Date.now() - started,
      metadata: {
        recommendation: generated.data.recommendation,
        role: editorial.role,
      },
    });
    const reviewId = await saveEditorialAIReview({
      requestId,
      actorId: editorial.userId,
      targetType: typeof body.targetType === "string" ? body.targetType : undefined,
      targetId: typeof body.targetId === "string" ? body.targetId : undefined,
      snapshotHash: hashText(draft),
      excerpt: safeExcerpt(draft),
      documentIds: documents.map((doc) => doc.id),
      output: generated.data as unknown as Record<string, unknown>,
      model: generated.model,
    });
    const used = new Set(generated.data.sourceKeys);
    return Response.json({
      requestId,
      reviewId,
      review: generated.data,
      sources: documents.filter((doc) => used.has(doc.sourceKey ?? "")),
      model: generated.model,
    });
  } catch (error) {
    await logAIRequest({
      requestKind: "editorial_review",
      actorId: editorial.userId,
      prompt: draft,
      groundedStatus: "error",
      latencyMs: Date.now() - started,
      metadata: { error: error instanceof Error ? error.message : "unknown" },
    });
    return Response.json({ error: "AI review gagal dijalankan." }, { status: 500 });
  }
}
