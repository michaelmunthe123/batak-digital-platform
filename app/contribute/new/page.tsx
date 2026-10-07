import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { getCommunityFormOptions } from "@/lib/community-repository";
import { createContributionDraft } from "../actions";

export const metadata = { title: "New Contribution | Batak Digital", robots: { index: false, follow: false } };

export default async function NewContributionPage() {
  const state = await getCommunityState();
  if (state.state !== "active") redirect("/contribute");
  const { entities } = await getCommunityFormOptions();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl font-semibold">Buat proposal kontribusi</h1>
      <p className="mt-4 leading-7 text-stone-600">Simpan sebagai draft dulu. Kamu dapat menambahkan sumber sebelum mengirim untuk review.</p>
      <form action={createContributionDraft} className="mt-8 space-y-5 rounded-2xl border border-stone-200 bg-white p-6">
        <label className="block text-sm font-medium">Jenis<select name="type" required className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2"><option value="correction">Correction</option><option value="source">Source proposal</option><option value="new_content">New content</option><option value="relationship">Relationship</option><option value="genealogy">Genealogy</option><option value="language">Language</option><option value="media">Media</option></select></label>
        <label className="block text-sm font-medium">Target entity <span className="font-normal text-stone-500">(opsional)</span><select name="target_entity_id" className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2"><option value="">— Proposal umum —</option>{entities.map((entity: any) => <option key={entity.id} value={entity.id}>{entity.title} · {entity.type}</option>)}</select></label>
        <label className="block text-sm font-medium">Judul proposal<input name="title" required minLength={5} maxLength={160} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Bagian/section <span className="font-normal text-stone-500">(opsional)</span><input name="section_key" placeholder="Origins, overview, source, relationship…" className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Alasan / justification<textarea name="rationale" required minLength={10} rows={5} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Usulan isi<textarea name="proposed_content" rows={8} maxLength={20000} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <button className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Simpan draft</button>
      </form>
    </main>
  );
}
