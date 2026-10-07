import Link from "next/link";
import { getCommunityState } from "@/lib/auth/community";

export const metadata = { title: "Contribute | Batak Digital" };

export default async function ContributePage() {
  const state = await getCommunityState();
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Phase 4 · Community & Contribution</p>
      <h1 className="mt-2 max-w-3xl font-serif text-5xl font-semibold leading-tight">Bantu memperbaiki pengetahuan tanpa menghapus proses verifikasi.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">Kontributor mengirim proposal, bukti, atau koreksi. Proposal tidak pernah langsung mengubah halaman publik. Reviewer melakukan triage dan editor menggabungkan perubahan yang layak.</p>
      <div className="mt-9 flex flex-wrap gap-3">{renderPrimaryAction(state.state)}<Link href="/contribute/guidelines" className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold">Panduan kontribusi</Link><Link href="/about/methodology" className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold">Metodologi sumber</Link></div>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        <Card n="01" title="Proposal, bukan direct edit" body="Koreksi selalu berada di staging contribution workflow sampai ditinjau." />
        <Card n="02" title="Evidence first" body="Klaim sensitif seperti genealogi, relasi, dan bahasa membutuhkan evidence source sebelum submission." />
        <Card n="03" title="Audit trail" body="Status, komentar reviewer, dan keputusan tercatat. Merged contribution menghasilkan revision record." />
      </section>

      <section className="mt-14 rounded-3xl bg-stone-950 p-7 text-stone-100 md:p-10">
        <h2 className="font-serif text-3xl font-semibold">Invitation-based pilot</h2>
        <p className="mt-4 max-w-3xl leading-7 text-stone-300">Phase 4 sengaja tidak membuka registrasi bebas. Tujuannya menguji beban moderasi, kualitas evidence, dan aturan komunitas sebelum akses diperluas. Tidak ada voting untuk menentukan “kebenaran” budaya.</p>
      </section>
    </main>
  );
}

function renderPrimaryAction(state: string) {
  if (state === "active") return <Link href="/account" className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Buka contributor workspace</Link>;
  if (state === "invited") return <Link href="/account/welcome" className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Aktifkan undangan</Link>;
  if (state === "anonymous") return <Link href="/account/login" className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Contributor login</Link>;
  return <span className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600">Community pilot belum tersedia pada environment ini</span>;
}

function Card({ n, title, body }: { n: string; title: string; body: string }) { return <article className="rounded-2xl border border-stone-200 bg-white p-6"><p className="text-xs font-semibold tracking-[0.18em] text-stone-400">{n}</p><h2 className="mt-3 font-serif text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-stone-600">{body}</p></article>; }
