import type { Metadata } from "next";
import Link from "next/link";
import { searchKnowledge } from "@/lib/repository";
import type { EntityType } from "@/lib/types";

export const metadata: Metadata = { title: "Pencarian" };

const typeLabel: Record<string, string> = {
  cultural_group: "Kelompok budaya", clan: "Marga / Merga", region: "Wilayah", tradition: "Adat / Tradisi", kinship_system: "Sistem kekerabatan", kinship_term: "Partuturan", language_variety: "Bahasa", artifact: "Artefak", performance: "Seni pertunjukan", textile: "Tekstil", architecture: "Arsitektur", cuisine: "Kuliner",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; sourced?: string }> }) {
  const { q = "", type = "", sourced = "" } = await searchParams;
  const types = type ? [type as EntityType] : undefined;
  const results = await searchKnowledge(q, { types, sourceBackedOnly: sourced === "1" });

  return <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
    <h1 className="font-serif text-5xl font-bold">Pencarian</h1>
    <p className="mt-3 max-w-2xl text-stone-600">Phase 2 menambahkan filter tipe dan opsi untuk hanya melihat entri yang sudah memiliki provenance sumber.</p>
    <form className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_15rem_auto_auto]" action="/search">
      <input name="q" defaultValue={q} placeholder="Cari marga, adat, bahasa, wilayah…" className="rounded-xl border border-stone-300 px-4 py-3" />
      <select name="type" defaultValue={type} className="rounded-xl border border-stone-300 px-4 py-3"><option value="">Semua tipe</option>{Object.entries(typeLabel).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>
      <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm"><input type="checkbox" name="sourced" value="1" defaultChecked={sourced === "1"} /> Ada sumber</label>
      <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">Cari</button>
    </form>
    <p className="mt-7 text-sm text-stone-600">{results.length} hasil{q.trim() ? ` untuk “${q}”` : " pada filter ini"}</p>
    <div className="mt-5 divide-y divide-stone-200 border-y border-stone-200">{results.map((result) => <article key={`${result.type}-${result.slug}`} className="py-6"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">{typeLabel[result.type] ?? result.type}</p>{result.sourceBacked ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">source-backed</span> : null}</div><h2 className="mt-2 font-serif text-2xl font-semibold"><Link href={result.href} className="underline-offset-4 hover:underline">{result.title}</Link></h2><p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{result.summary}</p></article>)}</div>
    {!results.length ? <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-7"><p className="font-semibold">Tidak ada hasil.</p><p className="mt-2 text-sm leading-6 text-stone-600">Coba hilangkan salah satu filter atau gunakan ejaan alternatif.</p></div> : null}
  </div>;
}
