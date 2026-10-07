import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { updateContributorProfile } from "../actions";

export const metadata = { title: "Contributor Profile | Batak Digital" };

export default async function ProfilePage() {
  const state = await getCommunityState();
  if (state.state !== "active") redirect("/account");
  const profile = state.profile;
  if (!profile) redirect("/account/welcome");

  return <main className="mx-auto max-w-2xl px-4 py-12 md:px-6"><h1 className="font-serif text-4xl font-semibold">Profil contributor</h1><p className="mt-4 text-stone-600">Skor kontribusi bukan ukuran otoritas budaya. Profil publik hanya menampilkan metadata yang kamu pilih untuk dipublikasikan.</p><form action={updateContributorProfile} className="mt-8 space-y-5 rounded-2xl border border-stone-200 bg-white p-6"><label className="block text-sm font-medium">Nama tampilan<input name="display_name" defaultValue={profile.displayName} required className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Slug<input name="slug" defaultValue={profile.slug} required className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Bio<textarea name="bio" defaultValue={profile.bio} maxLength={1000} rows={5} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Minat/topik <span className="font-normal text-stone-500">(pisahkan dengan koma)</span><input name="interests" defaultValue={profile.interests.join(", ")} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2" /></label><label className="flex items-start gap-3 rounded-xl border border-stone-200 p-4 text-sm"><input name="is_public" type="checkbox" defaultChecked={profile.isPublic} className="mt-1" /><span><strong>Tampilkan profil ke publik</strong><br/><span className="text-stone-500">Tidak pernah menampilkan email atau catatan membership internal.</span></span></label><button className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Simpan profil</button></form></main>;
}
