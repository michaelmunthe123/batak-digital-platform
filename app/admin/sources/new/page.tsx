import Link from "next/link";
import { createSourceDraft } from "@/app/admin/actions";
import { getEditorialState } from "@/lib/auth/editor";

export default async function NewSourcePage() {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized" || editorial.role === "reviewer") {
    return <NoAccess />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin" className="text-sm underline underline-offset-4">
        ← Editorial
      </Link>
      <h1 className="mt-7 font-serif text-4xl font-bold">Register source</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Sumber dibuat sebagai draft dan harus melalui review sebelum terlihat
        pada Source Library publik.
      </p>

      <form action={createSourceDraft} className="mt-8 space-y-5">
        <Field label="Judul" name="title" required />
        <Field label="Publisher / institusi" name="publisher" />
        <Field label="URL" name="url" type="url" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="text-sm font-semibold">Tipe</label>
            <select id="type" name="type" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
              <option value="academic">academic</option>
              <option value="institutional">institutional</option>
              <option value="archive">archive</option>
              <option value="oral_history">oral_history</option>
              <option value="community">community</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="text-sm font-semibold">Level</label>
            <select id="level" name="level" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
              {["A","B","C","D"].map((level) => <option key={level}>{level}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-semibold">Deskripsi</label>
          <textarea id="description" name="description" rows={5} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" />
        </div>
        <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">
          Simpan source draft
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, required, type = "text" }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">{label}</label>
      <input id={name} name={name} type={type} required={required} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" />
    </div>
  );
}

function NoAccess() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold">Tidak dapat membuat source</h1>
      <Link href="/admin" className="mt-6 inline-block underline underline-offset-4">Kembali</Link>
    </div>
  );
}
