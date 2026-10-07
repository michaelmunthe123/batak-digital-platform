import type { Metadata } from "next";
import { SourceList } from "@/components/source-list";
import { listPublishedSources } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Source Library",
  description: "Sumber awal dan metodologi provenance Batak Digital.",
};

export default async function SourcesPage() {
  const sources = await listPublishedSources();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
          Provenance
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Source Library</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">
          Registry sumber adalah bagian dari produk. Setiap sumber memiliki
          level dan tipe agar pengguna dapat memahami karakter bukti yang
          mendukung sebuah klaim.
        </p>
      </header>

      <div className="mt-10">
        <SourceList sources={sources} />
      </div>
    </div>
  );
}
