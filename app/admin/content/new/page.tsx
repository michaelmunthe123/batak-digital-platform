import Link from "next/link";
import { createEntityDraft } from "@/app/admin/actions";
import { getEditorialState } from "@/lib/auth/editor";

const entityTypes = [
  "cultural_group",
  "clan",
  "region",
  "tradition",
  "kinship_system",
  "kinship_term",
  "language_variety",
  "artifact",
  "performance",
  "textile",
  "architecture",
  "cuisine",
];

export default async function NewEntityPage() {
  const editorial = await getEditorialState();

  if (editorial.state !== "authorized" || editorial.role === "reviewer") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl font-bold">Tidak dapat membuat draft</h1>
        <p className="mt-4 text-stone-600">
          Halaman ini membutuhkan role admin atau editor.
        </p>
        <Link href="/admin" className="mt-6 inline-block underline underline-offset-4">
          Kembali ke editorial
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin" className="text-sm underline underline-offset-4">
        ← Editorial
      </Link>
      <h1 className="mt-7 font-serif text-4xl font-bold">Buat draft entity</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Phase 1 hanya membuat draft metadata dasar. Claim, source linking, dan
        review detail dikelola melalui database/editorial workflow berikutnya.
      </p>

      <form action={createEntityDraft} className="mt-8 space-y-5">
        <Field label="Judul" name="title" required />
        <Field label="Slug" name="slug" required placeholder="contoh: marga-munthe" />
        <div>
          <label htmlFor="type" className="text-sm font-semibold">
            Tipe entity
          </label>
          <select
            id="type"
            name="type"
            required
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            {entityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="summary" className="text-sm font-semibold">
            Ringkasan
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <button className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">
          Simpan sebagai draft
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
      />
    </div>
  );
}
