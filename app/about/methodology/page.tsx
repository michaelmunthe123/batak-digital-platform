import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodologi",
  description: "Metode sumber, klaim, variasi, dan editorial review.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
        Methodology
      </p>
      <h1 className="mt-3 font-serif text-5xl font-bold">
        Cara pengetahuan diterbitkan
      </h1>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="font-serif text-3xl font-semibold">1. Sumber bertingkat</h2>
          <p className="mt-3 leading-8 text-stone-700">
            Level A: akademik/primer. Level B: institusional. Level C:
            pakar/oral history dengan metadata. Level D: community source yang
            dapat menjadi lead tetapi tidak otomatis menjadi fakta terverifikasi.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl font-semibold">2. Claim-level provenance</h2>
          <p className="mt-3 leading-8 text-stone-700">
            Klaim penting dapat ditautkan ke satu atau lebih sumber beserta
            locator seperti halaman, bab, timestamp, atau catatan wawancara.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl font-semibold">3. Variasi tidak dihapus</h2>
          <p className="mt-3 leading-8 text-stone-700">
            Status klaim mendukung Verified, Supported, Regional Variation,
            Disputed, Community Sourced, dan Draft. Perbedaan sumber dicatat
            sebagai konteks, bukan diselesaikan secara arbitrer.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl font-semibold">4. Batas Phase 1</h2>
          <p className="mt-3 leading-8 text-stone-700">
            AI, akun publik, kontribusi komunitas, personal genealogy, tarombo
            visualizer, partuturan calculator, dan cultural map belum menjadi
            bagian MVP foundation.
          </p>
        </section>
      </div>
    </div>
  );
}
