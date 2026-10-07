"use client";

import { useState } from "react";
import { AISourceCard } from "@/components/ai-source-card";
import type { SemanticSearchResponse } from "@/lib/ai-types";

export function SemanticSearchClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SemanticSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await response.json()) as SemanticSearchResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Pencarian gagal.");
      setResult(data);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Pencarian gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-5 sm:flex-row">
        <input
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          maxLength={500}
          placeholder="Cari berdasarkan makna, misalnya: tradisi syukuran panen Karo"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-700"
        />
        <button disabled={loading || query.trim().length < 2} className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Mencari…" : "Semantic Search"}
        </button>
      </form>
      {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {result ? (
        <div className="mt-7">
          <p className="text-sm text-stone-500">{result.results.length} dokumen source-backed ditemukan.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.results.map((source) => <AISourceCard key={source.id} source={source} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
