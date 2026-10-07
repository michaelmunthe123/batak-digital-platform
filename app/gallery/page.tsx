import type { Metadata } from "next";
import { MediaGallery } from "@/components/media-gallery";
import { listMediaAssets } from "@/lib/phase2-repository";

export const metadata: Metadata = { title: "Media Gallery", description: "Galeri budaya dengan metadata hak dan lisensi yang eksplisit." };

export default async function GalleryPage() {
  const items = await listMediaAssets();
  return <div className="mx-auto max-w-7xl px-4 py-12 md:px-6"><header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Media rights first</p><h1 className="mt-3 font-serif text-5xl font-bold">Media gallery</h1><p className="mt-5 text-lg leading-8 text-stone-600">Aset visual, audio, dan dokumen tidak dianggap bebas digunakan hanya karena tersedia daring. Gallery menampilkan status hak sebelum media boleh direproduksi.</p></header><div className="mt-10"><MediaGallery items={items} /></div></div>;
}
