import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { EntityCard } from "@/components/entity-card";
import { listPublishedEntities, listPublishedSources } from "@/lib/repository";

export default async function HomePage() {
  const [entities, sources] = await Promise.all([
    listPublishedEntities(),
    listPublishedSources(),
  ]);
  const groups = entities.filter((item) => item.type === "cultural_group");
  const clans = entities.filter((item) => item.type === "clan");
  const featured = [
    ...groups.slice(0, 3),
    ...entities.filter((item) => item.type === "tradition").slice(0, 1),
  ];

  return (
    <>
      <section className="border-b border-stone-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
              Digital cultural knowledge platform
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-tight text-stone-950 md:text-7xl">
              Jelajahi budaya Batak dengan konteks dan sumber yang jelas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Marga, adat, wilayah, bahasa, dan warisan budaya disusun sebagai
              pengetahuan yang saling terhubung—tanpa memaksakan satu versi
              ketika sumber mencatat variasi.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBox />
            </div>
          </div>

          <aside className="rounded-3xl border border-stone-800 bg-stone-950 p-7 text-stone-100 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Prinsip utama
            </p>
            <p className="mt-4 font-serif text-3xl leading-tight">
              Preserve the complexity, simplify the experience.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="mt-1 text-xs text-stone-400">hub</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-bold">{clans.length}</p>
                <p className="mt-1 text-xs text-stone-400">marga</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-bold">{sources.length}</p>
                <p className="mt-1 text-xs text-stone-400">sumber</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">
              Mulai dari sini
            </p>
            <h2 className="mt-2 font-serif text-4xl font-semibold">
              Explore by knowledge
            </h2>
          </div>
          <Link className="text-sm font-semibold underline underline-offset-4" href="/explore">
            Lihat semua →
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/map" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Interactive</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Cultural Map</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Jelajahi titik referensi budaya tanpa menganggapnya sebagai batas identitas.</p>
          </Link>
          <Link href="/language" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Language</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Dictionary foundation</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Cari entri bahasa yang terhubung ke sumber leksikografi.</p>
          </Link>
          <Link href="/gallery" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Rights-aware</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Media Gallery</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Media dipublikasikan bersama status hak, lisensi, dan attribution metadata.</p>
          </Link>
          <Link href="/tarombo" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Genealogy</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Tarombo Visualizer</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Visualisasi node-edge source-aware dengan privacy rule untuk data keluarga.</p>
          </Link>
          <Link href="/partuturan" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Kinship</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Partuturan Calculator</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Rule engine yang hanya menjawab ketika hubungan dan sumbernya cukup.</p>
          </Link>
          <Link href="/relations" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Graph</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Relationship Explorer</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Telusuri path relasi yang benar-benar diterbitkan tanpa heuristik marga.</p>
          </Link>
          <Link href="/contribute" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Community</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Contribution workflow</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Kirim koreksi dan evidence sebagai proposal yang melalui moderasi dan audit trail.</p>
          </Link>
          <Link href="/assistant" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Grounded AI</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Cultural Assistant</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Tanya knowledge base dengan hybrid retrieval, sumber eksplisit, dan fail-safe ketika evidence belum cukup.</p>
          </Link>
          <Link href="/learn" className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Learning</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Personalized Learning</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Susun learning path berdasarkan minat dan level hanya dari materi yang sudah bersumber.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">
                Mengapa source-aware?
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold">
                Bukan sekadar artikel.
              </h2>
            </div>
            <div className="text-sm leading-7 text-stone-600 lg:col-span-2">
              <p>
                Model data memisahkan entitas, klaim, relasi, dan sumber. Phase 2 menambahkan map, timeline, dictionary, media rights, dan completeness tracking; Phase 3 menambahkan genealogy graph, partuturan rules, privacy, dan source-aware relationship paths; Phase 4 menambahkan invitation-based contributor workflow, moderation, reports, public contributor profiles, dan audit trail; Phase 5 menambahkan hybrid semantic retrieval, source-grounded AI, personalized learning paths, serta AI editorial review di atas fondasi yang sama.
                Artinya, satu versi asal-usul atau hubungan dapat memiliki
                provenance sendiri dan tidak harus menghapus versi lain yang
                juga terdokumentasi.
              </p>
              <Link
                className="mt-4 inline-block font-semibold text-stone-950 underline underline-offset-4"
                href="/about/methodology"
              >
                Baca metodologi editorial →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
