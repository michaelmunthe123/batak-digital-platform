import Link from "next/link";
import { getEditorialState } from "@/lib/auth/editor";
import { listCompletenessRows } from "@/lib/phase2-repository";

export default async function CompletenessPage() {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized") {
    return <div className="mx-auto max-w-5xl px-4 py-12 md:px-6"><h1 className="font-serif text-4xl font-bold">Content completeness</h1><p className="mt-4 text-stone-600">Dashboard ini hanya untuk tim editorial.</p><Link href="/admin" className="mt-6 inline-block font-semibold underline underline-offset-4">Kembali ke admin</Link></div>;
  }

  const rows = await listCompletenessRows();
  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0;
  const needsWork = rows.filter((row) => row.score < 67).length;

  return <div className="min-h-[70vh] bg-stone-100"><div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <Link href="/admin" className="text-sm font-semibold underline underline-offset-4">← Editorial workspace</Link>
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">Phase 2 dashboard</p><h1 className="mt-2 font-serif text-4xl font-bold">Content completeness</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Skor adalah alat editorial, bukan skor kebenaran. Ia hanya mengukur apakah elemen penting seperti sumber, section, relationship, media, dan data interaktif sudah tersedia.</p></div><div className="grid grid-cols-2 gap-3"><Metric label="Rata-rata" value={`${average}%`} /><Metric label="Perlu perhatian" value={String(needsWork)} /></div></div>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Summary</th><th className="px-4 py-3">Sections</th><th className="px-4 py-3">Sources</th><th className="px-4 py-3">Relations</th><th className="px-4 py-3">Media</th><th className="px-4 py-3">Interactive</th><th className="px-4 py-3">Missing</th></tr></thead><tbody className="divide-y divide-stone-100">{rows.map((row) => <tr key={row.entitySlug}><td className="px-4 py-4 font-semibold"><Link href={row.type === "clan" ? `/marga/${row.entitySlug}` : `/knowledge/${row.entitySlug}`} className="underline-offset-4 hover:underline">{row.title}</Link></td><td className="px-4 py-4 text-stone-500">{row.type}</td><td className="px-4 py-4"><span className="rounded-full bg-stone-100 px-2.5 py-1 font-semibold">{row.score}%</span></td>{[row.summary,row.sections,row.sources,row.relationships,row.media,row.interactiveData].map((ok, i) => <td key={i} className="px-4 py-4">{ok ? "✓" : "—"}</td>)}<td className="max-w-xs px-4 py-4 text-xs leading-5 text-stone-500">{row.missing.join(", ") || "—"}</td></tr>)}</tbody></table></div>
  </div></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="min-w-28 rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 font-serif text-3xl font-bold">{value}</p></div>; }
