"use client";

import { useState } from "react";
import { AISourceCard } from "@/components/ai-source-card";
import type { AIRetrievedDocument, EditorialAIReview } from "@/lib/ai-types";

export function AdminAIReviewClient() {
  const [draft, setDraft] = useState("");
  const [review, setReview] = useState<EditorialAIReview | null>(null);
  const [sources, setSources] = useState<AIRetrievedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, language: "id" }),
      });
      const data = (await response.json()) as {
        review?: EditorialAIReview;
        sources?: AIRetrievedDocument[];
        error?: string;
      };
      if (!response.ok || !data.review) throw new Error(data.error || "Review gagal.");
      setReview(data.review);
      setSources(data.sources ?? []);
    } catch (caught) {
      setReview(null);
      setSources([]);
      setError(caught instanceof Error ? caught.message : "Review gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_1fr]">
      <form onSubmit={runReview} className="rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-2xl font-semibold">Draft review</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">AI hanya memberi second-pass review. Keputusan editorial tetap manusia dan fitur ini tidak dapat mempublikasikan apa pun.</p>
        <textarea value={draft} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value)} rows={18} maxLength={10000} className="mt-5 w-full rounded-2xl border border-stone-300 bg-stone-50 p-4 text-sm leading-6 outline-none focus:border-stone-700" placeholder="Tempel draft claim/article section yang ingin direview…" />
        <button disabled={loading || draft.trim().length < 20} className="mt-4 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Membandingkan dengan sumber…" : "Jalankan AI review"}
        </button>
        {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      </form>

      <div aria-live="polite">
        {review ? (
          <div className="space-y-4">
            <article className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap gap-2"><span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-bold uppercase text-white">{review.recommendation}</span></div>
              <h2 className="mt-4 font-serif text-2xl font-semibold">Ringkasan review</h2>
              <p className="mt-3 text-sm leading-7 text-stone-700">{review.summary}</p>
              <List title="Klaim belum didukung" items={review.unsupportedClaims} />
              <List title="Pertanyaan untuk reviewer" items={review.reviewerQuestions} />
              <List title="Risk flags" items={review.riskFlags} />
            </article>
            {sources.length ? <div><h2 className="font-serif text-xl font-semibold">Context sources</h2><div className="mt-3 grid gap-3">{sources.map((source) => <AISourceCard key={source.id} source={source} />)}</div></div> : null}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-sm leading-7 text-stone-500">Hasil review akan menunjukkan klaim yang belum didukung, pertanyaan verifikasi, risk flags, dan sumber pembanding.</div>
        )}
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-5">
      <h3 className="text-sm font-bold text-stone-900">{title}</h3>
      {items.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-stone-600">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-stone-500">Tidak ada.</p>}
    </section>
  );
}
