import type { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { SearchBox } from "@/components/search-box";
import { listPublishedEntities } from "@/lib/repository";
import { searchLocalEntities } from "@/lib/search-core";

export const metadata: Metadata = {
  title: "Direktori Marga",
  description: "Cari dan jelajahi profil marga/merga.",
};

export default async function MargaDirectory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, entities] = await Promise.all([
    searchParams,
    listPublishedEntities(),
  ]);
  const clans = entities.filter((entity) => entity.type === "clan");
  const results = q.trim()
    ? searchLocalEntities(q, clans)
        .map((result) => clans.find((clan) => clan.slug === result.slug))
        .filter((item): item is (typeof clans)[number] => Boolean(item))
    : [...clans].sort((a, b) => a.title.localeCompare(b.title, "id-ID"));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
          Directory
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Marga / Merga</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">
          “Clan” adalah tipe internal. Istilah publik seperti marga atau merga
          dapat mengikuti konteks budaya masing-masing entri.
        </p>
        <div className="mt-7">
          <form action="/marga" role="search">
            <label htmlFor="marga-search" className="sr-only">
              Cari marga
            </label>
            <div className="flex gap-2">
              <input
                id="marga-search"
                name="q"
                defaultValue={q}
                type="search"
                placeholder="Contoh: Munthe"
                className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
              />
              <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">
                Cari
              </button>
            </div>
          </form>
        </div>
      </header>

      <div className="mt-10 flex items-center justify-between gap-4">
        <p className="text-sm text-stone-600">
          {results.length} entri{q ? ` untuk “${q}”` : ""}
        </p>
      </div>

      {results.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-8">
          <h2 className="font-serif text-2xl font-semibold">Belum ditemukan</h2>
          <p className="mt-2 text-stone-600">
            Coba ejaan lain atau gunakan pencarian global untuk melihat tipe
            pengetahuan lain.
          </p>
          <div className="mt-5 max-w-xl">
            <SearchBox defaultValue={q} />
          </div>
        </div>
      )}
    </div>
  );
}
