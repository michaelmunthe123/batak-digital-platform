import type { Metadata } from "next";
import Link from "next/link";
import { AssistantClient } from "@/components/assistant-client";

export const metadata: Metadata = {
  title: "AI Cultural Assistant",
  description: "Tanya knowledge base Batak Digital dengan jawaban source-grounded dan citation-aware.",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Phase 5 · grounded AI</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight">Batak Cultural Assistant</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">
          Assistant ini tidak diberi kebebasan untuk menjawab dari pengetahuan umum model. Pertanyaan dicocokkan ke dokumen Batak Digital yang sudah diterbitkan dan bersumber terlebih dahulu.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/about/ai" className="underline underline-offset-4">Bagaimana AI bekerja?</Link>
          <Link href="/semantic-search" className="underline underline-offset-4">Lihat semantic retrieval</Link>
        </div>
      </div>
      <div className="mt-10"><AssistantClient /></div>
    </div>
  );
}
