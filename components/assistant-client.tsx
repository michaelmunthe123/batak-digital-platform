"use client";

import { useState } from "react";
import { AISourceCard } from "@/components/ai-source-card";
import type { AssistantAPIResponse } from "@/lib/ai-types";

const examples = [
  "Apa yang dimaksud Dalihan Na Tolu berdasarkan sumber yang tersedia?",
  "Apa perbedaan sistem kekerabatan yang terdokumentasi pada Toba dan Karo?",
  "Apa yang diketahui platform tentang Merdang-Merdem?",
];

export function AssistantClient() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [result, setResult] = useState<AssistantAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setFeedbackSent(false);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language }),
      });
      const data = (await response.json()) as AssistantAPIResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Assistant gagal menjawab.");
      setResult(data);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(rating: -1 | 1) {
    if (!result?.requestId || feedbackSent) return;
    try {
      await fetch("/api/assistant/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: result.requestId,
          rating,
          reason: rating === 1 ? "helpful" : "incorrect",
        }),
      });
      setFeedbackSent(true);
    } catch {
      // Feedback is optional; do not interrupt the learning experience.
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <form onSubmit={submit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <label htmlFor="assistant-question" className="font-serif text-2xl font-semibold">
            Tanya knowledge base
          </label>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Assistant hanya boleh memakai dokumen terpublikasi yang sudah terhubung ke sumber.
          </p>
          <textarea
            id="assistant-question"
            value={question}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
            rows={7}
            maxLength={1500}
            placeholder="Contoh: Apa fungsi Tulang dalam konteks yang didokumentasikan sumber?"
            className="mt-5 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm leading-6 outline-none focus:border-stone-700"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-medium text-stone-700">
              Bahasa jawaban{" "}
              <select
                value={language}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setLanguage(event.target.value === "en" ? "en" : "id")}
                className="ml-2 rounded-lg border border-stone-300 bg-white px-2 py-1.5"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading || question.trim().length < 3}
              className="rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Mencari sumber…" : "Tanya AI"}
            </button>
          </div>
          {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        </form>

        <div className="mt-5 rounded-3xl border border-stone-200 bg-stone-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Contoh pertanyaan</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuestion(example)}
                className="rounded-full border border-stone-300 bg-white px-3 py-2 text-left text-xs leading-5 hover:border-stone-500"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div aria-live="polite">
        {!result && !loading ? (
          <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-sm leading-7 text-stone-500">
            Jawaban akan tampil di sini bersama sumber yang benar-benar digunakan. Jika bukti tidak cukup, assistant harus mengatakan bahwa informasi belum cukup.
          </div>
        ) : null}
        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 text-sm text-stone-600">
            Melakukan hybrid retrieval dan memeriksa konteks sumber…
          </div>
        ) : null}
        {result ? (
          <div>
            <article className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  {result.confidence}
                </span>
                {result.model ? <span className="text-xs text-stone-500">{result.model}</span> : null}
              </div>
              <div className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-stone-800">
                {result.answer}
              </div>
              {result.caution ? (
                <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  {result.caution}
                </p>
              ) : null}
              {result.requestId ? (
                <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4 text-sm">
                  <span className="text-stone-500">Jawaban ini membantu?</span>
                  <button onClick={() => sendFeedback(1)} disabled={feedbackSent} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Ya</button>
                  <button onClick={() => sendFeedback(-1)} disabled={feedbackSent} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Tidak</button>
                  {feedbackSent ? <span className="text-xs text-stone-500">Terima kasih.</span> : null}
                </div>
              ) : null}
            </article>

            <section className="mt-6">
              <h2 className="font-serif text-2xl font-semibold">Sumber yang digunakan</h2>
              <div className="mt-4 grid gap-3">
                {result.sources.length ? result.sources.map((source) => (
                  <AISourceCard key={source.id} source={source} />
                )) : (
                  <p className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-500">
                    Tidak ada sumber yang cukup untuk mendukung jawaban faktual.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
