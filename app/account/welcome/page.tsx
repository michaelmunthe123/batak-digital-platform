import Link from "next/link";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { activateContributorAccount } from "../actions";

export const metadata = { title: "Aktivasi Contributor | Batak Digital" };

export default async function ContributorWelcomePage() {
  const state = await getCommunityState();
  if (state.state === "anonymous") redirect("/account/login");
  if (state.state === "active") redirect("/account");

  if (state.state === "unconfigured") return <StateMessage title="Supabase belum dikonfigurasi" body="Aktivasi akun membutuhkan Supabase Auth dan migration Phase 4." />;
  if (state.state === "not_member") return <StateMessage title="Tidak ada undangan contributor" body="Akun ini terautentikasi tetapi tidak memiliki membership contributor." />;
  if (state.state === "suspended") return <StateMessage title="Akses contributor ditangguhkan" body="Hubungi pengelola platform untuk klarifikasi." />;

  return (
    <main className="mx-auto max-w-2xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Invitation accepted</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">Aktifkan profil contributor</h1>
      <p className="mt-4 leading-7 text-stone-600">Tentukan nama tampilan, URL profil, dan password. Profil belum otomatis publik; kamu dapat mengaturnya setelah aktivasi.</p>
      <form action={activateContributorAccount} className="mt-8 space-y-5 rounded-2xl border border-stone-200 bg-white p-6">
        <label className="block text-sm font-medium">Nama tampilan<input name="display_name" required minLength={2} maxLength={80} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Slug profil<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="nama-kontributor" className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Password baru<input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label>
        <button className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Aktifkan akun</button>
      </form>
    </main>
  );
}

function StateMessage({ title, body }: { title: string; body: string }) {
  return <main className="mx-auto max-w-xl px-4 py-16"><h1 className="font-serif text-4xl font-semibold">{title}</h1><p className="mt-4 text-stone-600">{body}</p><Link href="/contribute" className="mt-6 inline-block font-semibold underline">Kembali ke halaman kontribusi</Link></main>;
}
