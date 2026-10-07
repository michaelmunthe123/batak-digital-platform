import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GenealogyTree } from "@/components/genealogy-tree";
import { getGenealogyGraph } from "@/lib/phase3-repository";

export default async function TaromboDatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const graph = await getGenealogyGraph(slug);
  if (!graph) notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tarombo", href: "/tarombo" }, { label: graph.dataset.title }]} />
      <header className="mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">{graph.dataset.isDemo ? "Demo fiktif" : "Source-aware genealogy"}</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">{graph.dataset.title}</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">{graph.dataset.description}</p>
      </header>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm leading-6 text-stone-700">{graph.dataset.methodologyNote}</div>
      <section className="mt-8"><GenealogyTree graph={graph} /></section>
      <section className="mt-10">
        <h2 className="font-serif text-3xl font-semibold">Edge ledger</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50"><tr><th className="p-3">From</th><th className="p-3">Relation</th><th className="p-3">To</th><th className="p-3">Status</th><th className="p-3">Sources</th></tr></thead>
            <tbody>{graph.edges.map((edge) => <tr key={edge.id} className="border-b border-stone-100"><td className="p-3">{graph.nodes.find((n) => n.id === edge.sourceNodeId)?.label}</td><td className="p-3 font-medium">{edge.relation}</td><td className="p-3">{graph.nodes.find((n) => n.id === edge.targetNodeId)?.label}</td><td className="p-3">{edge.status}</td><td className="p-3">{edge.sourceIds.length ? edge.sourceIds.join(", ") : graph.dataset.isDemo ? "demo-only" : "—"}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
