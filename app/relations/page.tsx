import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelationshipPath } from "@/components/relationship-path";
import { pilotEntities } from "@/lib/pilot-data";
import { listRelationshipEdges } from "@/lib/phase3-repository";
import { findRelationshipPath } from "@/lib/relationship-engine";

export const metadata = { title: "Relationship Explorer" };

export default async function RelationsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const params = await searchParams;
  const edges = await listRelationshipEdges();
  const candidates = pilotEntities.filter((entity) => ["cultural_group", "clan", "kinship_system", "kinship_term"].includes(entity.type));
  const from = params.from ?? "karo";
  const to = params.to ?? "senina";
  const path = findRelationshipPath(from, to, edges);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Relations" }]} />
      <header className="mt-8 max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">Knowledge graph</p><h1 className="mt-3 font-serif text-6xl font-bold">Relationship Explorer</h1><p className="mt-5 text-lg leading-8 text-stone-600">Menelusuri relasi yang benar-benar tersimpan di knowledge graph. Path bukan bukti hubungan darah antarindividu.</p></header>
      <form className="mt-8 grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="text-sm font-semibold">Dari<select name="from" defaultValue={from} className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-3 py-3">{candidates.map((entity) => <option key={entity.slug} value={entity.slug}>{entity.title}</option>)}</select></label>
        <label className="text-sm font-semibold">Ke<select name="to" defaultValue={to} className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-3 py-3">{candidates.map((entity) => <option key={entity.slug} value={entity.slug}>{entity.title}</option>)}</select></label>
        <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white" type="submit">Telusuri</button>
      </form>
      <section className="mt-8"><RelationshipPath path={path} /></section>
      <p className="mt-6 text-sm leading-6 text-stone-500">Jika dua marga tidak mempunyai path yang diterbitkan, hasilnya tetap kosong. Fitur ini sengaja tidak menggunakan heuristik nama, cerita populer tanpa sumber, atau nearest-match.</p>
    </div>
  );
}
