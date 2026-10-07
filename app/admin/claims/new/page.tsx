import Link from "next/link";
import { createClaimDraft } from "@/app/admin/actions";
import { getClaimFormOptions } from "@/lib/admin-data";
import { getEditorialState } from "@/lib/auth/editor";

export default async function NewClaimPage() {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized" || editorial.role === "reviewer") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl font-bold">Tidak dapat membuat claim</h1>
        <Link href="/admin" className="mt-6 inline-block underline underline-offset-4">Kembali</Link>
      </div>
    );
  }

  const options = await getClaimFormOptions();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin" className="text-sm underline underline-offset-4">← Editorial</Link>
      <h1 className="mt-7 font-serif text-4xl font-bold">Create sourced claim</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Claim dibuat sebagai draft. Reviewer/admin kemudian memberi status
        Supported, Verified, Regional Variation, Disputed, atau Community Sourced.
      </p>

      <form action={createClaimDraft} className="mt-8 space-y-5">
        <div>
          <label htmlFor="entity_id" className="text-sm font-semibold">Entity</label>
          <select id="entity_id" name="entity_id" required className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
            <option value="">Pilih entity</option>
            {options.entities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="source_id" className="text-sm font-semibold">Source</label>
          <select id="source_id" name="source_id" required className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
            <option value="">Pilih source</option>
            {options.sources.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="body" className="text-sm font-semibold">Claim</label>
          <textarea id="body" name="body" rows={6} required className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" />
        </div>
        <div>
          <label htmlFor="locator" className="text-sm font-semibold">Locator</label>
          <input id="locator" name="locator" placeholder="hal. 72 / bab 3 / timestamp 12:40" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" />
        </div>
        <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">
          Simpan claim draft
        </button>
      </form>
    </div>
  );
}
