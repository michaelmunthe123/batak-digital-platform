import Link from "next/link";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { getOwnContributions, getOwnNotifications, getOwnReports } from "@/lib/community-repository";
import { signOutContributor } from "./login/actions";

export const metadata = { title: "Contributor Account | Batak Digital" };

export default async function AccountPage() {
  const state = await getCommunityState();
  if (state.state === "anonymous") redirect("/account/login");
  if (state.state === "invited") redirect("/account/welcome");
  if (state.state !== "active") return <main className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-serif text-4xl font-semibold">Contributor account</h1><p className="mt-4 text-stone-600">Status akun: {state.state}. Akses kontribusi belum tersedia.</p></main>;

  const [contributions, notifications, reports] = await Promise.all([
    getOwnContributions(state.userId),
    getOwnNotifications(state.userId),
    getOwnReports(state.userId),
  ]);
  const unread = notifications.filter((item) => !item.readAt).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Contributor workspace</p><h1 className="mt-2 font-serif text-4xl font-semibold">{state.profile?.displayName ?? state.email ?? "Contributor"}</h1><p className="mt-3 text-stone-600">Proposal bersifat terpisah dari konten publik sampai melalui review.</p></div>
        <form action={signOutContributor}><button className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold">Keluar</button></form>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Metric label="Total proposal" value={contributions.length} />
        <Metric label="Merged" value={contributions.filter((item) => item.status === "merged").length} />
        <Metric label="Notifikasi baru" value={unread} />
        <Metric label="Report" value={reports.length} />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Action href="/contribute/new" title="Buat proposal" body="Koreksi, sumber, konten, relasi, bahasa, atau media." />
        <Action href="/account/contributions" title="Kontribusi saya" body="Pantau draft, review, evidence request, dan keputusan." />
        <Action href="/account/notifications" title="Notifikasi" body="Lihat perubahan status dan feedback reviewer." />
        <Action href="/account/profile" title="Profil" body="Atur bio, minat, dan visibilitas profil contributor." />
      </div>
      <div className="mt-4"><Action href="/report" title="Laporkan informasi" body="Tandai kesalahan, sumber yang hilang, isu privasi, copyright, atau sensitivitas budaya." /></div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-stone-500">{label}</p></div>; }
function Action({ href, title, body }: { href: string; title: string; body: string }) { return <Link href={href} className="block rounded-2xl border border-stone-200 bg-white p-5 hover:border-stone-400"><h2 className="font-serif text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{body}</p></Link>; }
