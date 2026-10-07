import { saveAIFeedback } from "@/lib/ai-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    requestId?: unknown;
    rating?: unknown;
    reason?: unknown;
    comment?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  const requestId = typeof body.requestId === "string" ? body.requestId : "";
  const rating = body.rating === 1 ? 1 : body.rating === -1 ? -1 : undefined;
  if (!requestId || !rating) {
    return Response.json({ error: "requestId dan rating diperlukan." }, { status: 400 });
  }

  try {
    await saveAIFeedback({
      requestId,
      rating,
      reason: typeof body.reason === "string" ? body.reason : undefined,
      comment: typeof body.comment === "string" ? body.comment : undefined,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Feedback tidak dapat disimpan." }, { status: 500 });
  }
}
