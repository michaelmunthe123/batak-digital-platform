import type { Metadata } from "next";
import { SemanticSearchClient } from "@/components/semantic-search-client";

export const metadata: Metadata = {
  title: "Semantic Search",
  description: "Hybrid keyword + semantic search pada dokumen budaya yang source-backed.",
};

export default function SemanticSearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Hybrid retrieval</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Semantic Search</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
        Pencarian ini menggabungkan full-text search PostgreSQL dan similarity search pgvector. Hasilnya adalah potongan knowledge base yang sudah memiliki provenance sumber—tanpa generasi jawaban AI.
      </p>
      <div className="mt-9"><SemanticSearchClient /></div>
    </div>
  );
}
