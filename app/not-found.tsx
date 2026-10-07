import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">
        404
      </p>
      <h1 className="mt-3 font-serif text-5xl font-bold">Halaman belum ada.</h1>
      <p className="mt-5 text-stone-600">
        Entri mungkin belum menjadi bagian dataset pilot atau URL tidak sesuai.
      </p>
      <Link
        href="/"
        className="mt-7 inline-block font-semibold underline underline-offset-4"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
