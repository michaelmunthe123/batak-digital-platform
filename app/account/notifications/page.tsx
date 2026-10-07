import Link from "next/link";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { getOwnNotifications } from "@/lib/community-repository";
import { markNotificationRead } from "../actions";

export const metadata = { title: "Notifikasi Contributor | Batak Digital" };

export default async function NotificationsPage() {
  const state = await getCommunityState();
  if (state.state !== "active") redirect("/account");
  const rows = await getOwnNotifications(state.userId);
  return <main className="mx-auto max-w-3xl px-4 py-12 md:px-6"><h1 className="font-serif text-4xl font-semibold">Notifikasi</h1><div className="mt-8 space-y-3">{rows.length ? rows.map((row) => <article key={row.id} className={`rounded-2xl border p-5 ${row.readAt ? "border-stone-200 bg-white" : "border-stone-400 bg-stone-50"}`}><div className="flex justify-between gap-4"><div><h2 className="font-semibold">{row.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{row.body}</p>{row.href ? <Link href={row.href} className="mt-3 inline-block text-sm font-semibold underline">Buka</Link> : null}</div>{!row.readAt ? <form action={markNotificationRead}><input type="hidden" name="id" value={row.id}/><button className="text-xs font-semibold underline">Tandai dibaca</button></form> : null}</div></article>) : <p className="text-stone-500">Belum ada notifikasi.</p>}</div></main>;
}
