import type { Metadata } from "next";
import Link from "next/link";
import { EntityCard } from "@/components/entity-card";
import { listTimelineSteps } from "@/lib/phase2-repository";
import { listPublishedEntities } from "@/lib/repository";

export const metadata: Metadata = { title: "Adat & Tradisi", description: "Direktori adat dan tradisi dengan timeline source-aware dan konteks variasi." };

export default async function TraditionsPage() {
  const [entities, steps] = await Promise.all([listPublishedEntities(), listTimelineSteps()]);
  const items = entities.filter((entity) => entity.type === "tradition" || entity.type === "textile" || entity.type === "performance");
  const timelineSlugs = new Set(steps.map((step) => step.traditionSlug));

  return <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Adat & budaya</p><h1 className="mt-3 font-serif text-5xl font-bold">Tradisi dalam konteks</h1><p className="mt-5 text-lg leading-8 text-stone-600">Timeline adat pada Phase 2 bersifat source-aware. Platform tidak memberi instruksi ritual universal tanpa komunitas, wilayah, peran, dan sumber yang jelas.</p></header>
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((entity) => <div key={entity.slug} className="relative"><EntityCard entity={entity} />{timelineSlugs.has(entity.slug) ? <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-900">timeline</span> : null}</div>)}</div>
    <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6"><h2 className="font-serif text-2xl font-semibold">Bagaimana timeline divalidasi?</h2><p className="mt-2 text-sm leading-6 text-stone-600">Urutan yang belum memiliki sumber hanya disimpan sebagai draft editorial. Perbedaan versi ditampilkan sebagai variation step, bukan dipaksa menjadi satu urutan.</p><Link href="/about/methodology" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Baca metodologi →</Link></div>
  </div>;
}
