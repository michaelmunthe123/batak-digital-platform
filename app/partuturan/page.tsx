import { Breadcrumbs } from "@/components/breadcrumbs";
import { PartuturanCalculator } from "@/components/partuturan-calculator";
import { SourceList } from "@/components/source-list";
import { listKinshipRules } from "@/lib/phase3-repository";
import { listPublishedSources } from "@/lib/repository";

export const metadata = { title: "Partuturan Calculator", description: "Calculator partuturan terbatas yang menggunakan hubungan eksplisit dan rule bersumber." };

export default async function PartuturanPage() {
  const [rules, sourceRegistry] = await Promise.all([listKinshipRules(), listPublishedSources()]);
  const sourceIds = new Set(rules.flatMap((rule) => rule.sourceIds));
  const sources = sourceRegistry.filter((source) => sourceIds.has(source.id));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Partuturan" }]} />
      <header className="mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">Kinship tools</p>
        <h1 className="mt-3 font-serif text-6xl font-bold">Partuturan Calculator</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">Pilih konteks budaya dan hubungan yang memang sudah diketahui. Calculator hanya mengembalikan istilah ketika ada rule yang diterbitkan dan memiliki provenance.</p>
      </header>
      <div className="mt-8"><PartuturanCalculator rules={rules} /></div>
      <section className="mt-12"><h2 className="font-serif text-3xl font-semibold">Batasan penting</h2><ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-stone-700"><li>Tidak menebak hubungan dari dua marga.</li><li>Tidak menggantikan proses martutur/ertutur dengan keluarga atau praktisi adat.</li><li>Rule pilot belum mencakup keseluruhan partuturan Batak.</li><li>Jika sumber berbeda, rule dapat ditandai regional variation atau disputed.</li></ul></section>
      <section className="mt-12"><h2 className="font-serif text-3xl font-semibold">Sumber rule pilot</h2><div className="mt-5"><SourceList sources={sources} /></div></section>
    </div>
  );
}
