import Link from "next/link";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { getOwnContributions } from "@/lib/community-repository";
import { CommunityStatusBadge } from "@/components/community-status-badge";

export const metadata = { title: "Kontribusi Saya | Batak Digital" };

export default async function ContributionsPage() {
  const state = await getCommunityState();
  if (state.state !== "active") redirect("/account");
  const rows = await getOwnContributions(state.userId);
  return <main className="mx-auto max-w-5xl px-4 py-12 md:px-6"><div className="flex items-end justify-between gap-4"><div><h1 className="font-serif text-4xl font-semibold">Kontribusi saya</h1><p className="mt-3 text-stone-600">Riwayat proposal dan status moderasinya.</p></div><Link href="/contribute/new" className="rounded-xl bg-stone-950 px-4 py-2 text-sm font-semibold text-white">Proposal baru</Link></div><div className="mt-8 space-y-3">{rows.length ? rows.map((row) => <Link href={`/contribute/${row.id}`} key={row.id} className="block rounded-2xl border border-stone-200 bg-white p-5 hover:border-stone-400"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{row.type.replaceAll("_"," ")}</p><h2 className="mt-1 font-serif text-xl font-semibold">{row.title}</h2><p className="mt-1 text-sm text-stone-500">{row.targetEntityTitle ?? "Proposal umum"}</p></div><CommunityStatusBadge status={row.status} /></div></Link>) : <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500">Belum ada proposal.</p>}</div></main>;
}
