import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tentang Proyek" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
        About
      </p>
      <h1 className="mt-3 font-serif text-5xl font-bold">
        Batak Digital Knowledge Platform
      </h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-stone-700">
        <p>
          Batak Digital dirancang sebagai platform pengetahuan budaya yang
          menghubungkan entitas, klaim, relasi, dan sumber. Tujuannya bukan
          menggantikan tokoh adat atau literatur akademik, tetapi membuat
          pengetahuan lebih mudah dijelajahi dan diverifikasi.
        </p>
        <p>
          Phase 1 adalah fondasi MVP: struktur data, source library, search,
          direktori marga, entity pages, dan workflow editorial minimal.
        </p>
      </div>
      <Link
        href="/about/methodology"
        className="mt-8 inline-block font-semibold underline underline-offset-4"
      >
        Lihat metodologi →
      </Link>
    </div>
  );
}
