import { notFound } from "next/navigation";
import { getPublicContributor } from "@/lib/community-repository";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublicContributor(slug);
  return { title: data ? `${data.profile.displayName} | Contributor` : "Contributor | Batak Digital" };
}

export default async function ContributorPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublicContributor(slug);
  if (!data) notFound();
  const { profile, stats } = data;
  return <main className="mx-auto max-w-3xl px-4 py-14 md:px-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Community contributor</p><h1 className="mt-2 font-serif text-5xl font-semibold">{profile.displayName}</h1><p className="mt-5 max-w-2xl leading-7 text-stone-600">{profile.bio || "Contributor Batak Digital."}</p>{profile.interests.length ? <div className="mt-6 flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="rounded-full border border-stone-300 px-3 py-1 text-sm">{interest}</span>)}</div> : null}<section className="mt-10 grid gap-4 sm:grid-cols-4"><Metric label="Submitted" value={stats.submittedCount}/><Metric label="Accepted" value={stats.acceptedCount}/><Metric label="Merged" value={stats.mergedCount}/><Metric label="Editorial score" value={stats.editorialScore}/></section><p className="mt-6 rounded-xl bg-stone-100 p-4 text-sm leading-6 text-stone-600"><strong>Catatan:</strong> editorial score hanya ringkasan aktivitas proposal yang diterima/merged. Ini bukan ukuran keahlian, status adat, senioritas, atau otoritas budaya seseorang.</p></main>;
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-stone-500">{label}</p></div>; }
