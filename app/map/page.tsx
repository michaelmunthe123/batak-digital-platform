import type { Metadata } from "next";
import { CulturalMap } from "@/components/cultural-map";
import { listMapLocations } from "@/lib/phase2-repository";

export const metadata: Metadata = { title: "Cultural Map", description: "Atlas budaya interaktif dengan titik referensi yang tidak mengklaim batas budaya." };

export default async function MapPage() {
  const points = await listMapLocations();
  return <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Cultural map</p><h1 className="mt-3 font-serif text-5xl font-bold">Jelajahi budaya melalui tempat</h1><p className="mt-5 text-lg leading-8 text-stone-600">Peta ini adalah alat navigasi pengetahuan. Titik representatif menghubungkan entri budaya dengan lokasi referensi tanpa menggambar batas identitas yang kaku.</p></header>
    <div className="mt-10"><CulturalMap points={points} /></div>
  </div>;
}
