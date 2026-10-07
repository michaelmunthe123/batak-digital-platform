import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { listGenealogyDatasets } from "@/lib/phase3-repository";

export const metadata = {
  title: "Tarombo & Genealogi",
  description: "Visualisasi genealogi source-aware dengan privasi dan status bukti yang eksplisit.",
};

export default async function TaromboPage() {
  const datasets = await listGenealogyDatasets();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tarombo" }]} />
      <header className="mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">Phase 3 · Genealogy</p>
        <h1 className="mt-3 font-serif text-6xl font-bold">Tarombo visualizer</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">Genealogi disimpan sebagai node dan edge yang memiliki status, provenance, dan aturan privasi. Platform tidak membuat silsilah nyata hanya dari nama marga.</p>
      </header>
      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-serif text-2xl font-semibold">Safety rule</h2>
        <p className="mt-2 leading-7 text-stone-700">Data orang hidup tidak boleh dipublikasikan secara terbuka pada model Phase 3. Dataset privat/restricted hanya dapat dibaca oleh pihak editorial yang berwenang. Tarombo yang memiliki versi berbeda dapat menyimpan assertion yang berbeda beserta sumbernya.</p>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-3xl font-semibold">Dataset tersedia</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {datasets.map((dataset) => (
            <Link key={dataset.id} href={`/tarombo/${dataset.slug}`} className="rounded-3xl border border-stone-200 bg-white p-6 hover:border-stone-400">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500"><span>{dataset.visibility}</span>{dataset.isDemo ? <span>· DEMO FIKTIF</span> : null}</div>
              <h3 className="mt-3 font-serif text-2xl font-semibold">{dataset.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{dataset.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
