"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-serif text-4xl font-bold">Terjadi kesalahan.</h1>
      <p className="mt-4 text-stone-600">
        Konten gagal dimuat. Data pilot tetap dirancang agar situs publik dapat
        berjalan tanpa konfigurasi Supabase.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white"
      >
        Coba lagi
      </button>
    </div>
  );
}
