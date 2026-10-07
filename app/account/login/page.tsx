import Link from "next/link";
import { signInContributor } from "./actions";

export const metadata = { title: "Contributor Login | Batak Digital" };

export default async function ContributorLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-lg px-4 py-16 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Community</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">Contributor login</h1>
      <p className="mt-4 leading-7 text-stone-600">
        Phase 4 memakai invitation-based pilot. Akun kontributor hanya digunakan untuk mengirim proposal dan koreksi; akun tidak dapat mengedit halaman publik secara langsung.
      </p>
      {params.error ? <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">Login atau konfirmasi undangan gagal. Periksa kredensial atau gunakan ulang tautan undangan.</p> : null}
      <form action={signInContributor} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Password<input name="password" type="password" required className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <button className="w-full rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Masuk</button>
      </form>
      <p className="mt-6 text-sm text-stone-500">Belum diundang? Baca <Link href="/contribute" className="font-semibold text-stone-900 underline">cara kontribusi</Link>.</p>
    </main>
  );
}
