import type { Metadata } from "next";
import Link from "next/link";
import { listDictionaryEntries } from "@/lib/phase2-repository";
import { listPublishedEntities } from "@/lib/repository";

export const metadata: Metadata = { title: "Bahasa & Dictionary", description: "Fondasi kamus source-aware untuk bahasa dan varietas Batak." };

export default async function LanguagePage({ searchParams }: { searchParams: Promise<{ q?: string; language?: string }> }) {
  const { q = "", language = "" } = await searchParams;
  const entities = await listPublishedEntities();
  const languages = entities.filter((e) => e.type === "language_variety");
  const entries = await listDictionaryEntries({ q, language: language || undefined });
  return <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Language foundation</p><h1 className="mt-3 font-serif text-5xl font-bold">Bahasa & dictionary</h1><p className="mt-5 text-lg leading-8 text-stone-600">Bahasa disimpan sebagai entitas terpisah dari kelompok budaya. Entri kamus hanya diterbitkan bila sumber leksikografi dan asal definisinya dapat ditelusuri.</p></header>
    <form className="mt-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_16rem_auto]" action="/language">
      <input name="q" defaultValue={q} placeholder="Cari kata atau arti…" className="rounded-xl border border-stone-300 px-4 py-3" />
      <select name="language" defaultValue={language} className="rounded-xl border border-stone-300 px-4 py-3"><option value="">Semua bahasa</option>{languages.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select>
      <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">Cari</button>
    </form>
    <section className="mt-10"><h2 className="font-serif text-3xl font-semibold">Varietas bahasa</h2><div className="mt-4 flex flex-wrap gap-2">{languages.map((item) => <Link key={item.slug} href={`/knowledge/${item.slug}`} className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold">{item.title}</Link>)}</div></section>
    <section className="mt-10"><h2 className="font-serif text-3xl font-semibold">Entri terverifikasi pilot</h2><div className="mt-5 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">{entries.length ? entries.map((entry) => <article key={entry.id} className="grid gap-2 p-5 md:grid-cols-[12rem_1fr_10rem]"><div><h3 className="font-serif text-2xl font-semibold">{entry.headword}</h3><p className="text-xs text-stone-500">{entry.partOfSpeech ?? "—"}</p></div><div><p className="font-medium">{entry.definitionId}</p>{entry.usageNote ? <p className="mt-1 text-sm text-stone-500">{entry.usageNote}</p> : null}</div><p className="text-sm text-stone-500">{entry.languageLabel}</p></article>) : <p className="p-5 text-sm text-stone-500">Belum ada entri yang cocok.</p>}</div></section>
  </div>;
}
