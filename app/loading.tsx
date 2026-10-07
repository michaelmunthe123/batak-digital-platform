export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6" role="status">
      <div className="h-4 w-36 animate-pulse rounded bg-stone-200" />
      <div className="mt-5 h-12 max-w-xl animate-pulse rounded bg-stone-200" />
      <div className="mt-7 h-24 max-w-3xl animate-pulse rounded bg-stone-200" />
      <span className="sr-only">Memuat konten…</span>
    </div>
  );
}
