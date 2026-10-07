import type { Metadata } from "next";
import Link from "next/link";
import { EntityCard } from "@/components/entity-card";
import { listPublishedEntities } from "@/lib/repository";

export const metadata: Metadata = { title: "Explore", description: "Jelajahi kelompok budaya, adat, bahasa, wilayah, dan media Batak." };

export default async function ExplorePage() {
  const entities = await listPublishedEntities();
  const groups = entities.filter((entity) => entity.type === "cultural_group");
  const languages = entities.filter((entity) => entity.type === "language_variety");
  const other = entities.filter((entity) => !["cultural_group","clan","language_variety"].includes(entity.type));
  return <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Explore</p><h1 className="mt-3 font-serif text-5xl font-bold">Jelajahi pengetahuan</h1><p className="mt-5 text-lg leading-8 text-stone-600">Hub budaya adalah navigasi bersumber, bukan pernyataan bahwa hanya ada satu klasifikasi Batak yang sah.</p></header>
    <nav className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Interactive explorers"><Link href="/map" className="rounded-2xl border border-stone-200 bg-white p-4 font-semibold">Cultural Map →</Link><Link href="/language" className="rounded-2xl border border-stone-200 bg-white p-4 font-semibold">Bahasa & Dictionary →</Link><Link href="/gallery" className="rounded-2xl border border-stone-200 bg-white p-4 font-semibold">Media Gallery →</Link></nav>
    <section aria-labelledby="groups-heading" className="mt-12"><h2 id="groups-heading" className="font-serif text-3xl font-semibold">Cultural groups — navigation</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{groups.map((entity) => <EntityCard key={entity.slug} entity={entity} />)}</div></section>
    <section aria-labelledby="language-heading" className="mt-14"><h2 id="language-heading" className="font-serif text-3xl font-semibold">Bahasa</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{languages.map((entity) => <EntityCard key={entity.slug} entity={entity} />)}</div></section>
    <section aria-labelledby="topics-heading" className="mt-14"><h2 id="topics-heading" className="font-serif text-3xl font-semibold">Topik lainnya</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{other.map((entity) => <EntityCard key={entity.slug} entity={entity} />)}</div></section>
  </div>;
}
