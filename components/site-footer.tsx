import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-950 text-stone-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-lg font-semibold text-white">
            Batak Digital Knowledge Platform
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-stone-400">
            Preserve the complexity, simplify the experience.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Prinsip editorial</p>
          <p className="mt-2 text-sm leading-6 text-stone-400">
            Klaim penting harus dapat ditelusuri ke sumber. Variasi terdokumentasi
            dapat hidup berdampingan.
          </p>
        </div>
        <div className="text-sm">
          <Link className="underline underline-offset-4" href="/about/methodology">
            Metodologi
          </Link>
          <span className="mx-2 text-stone-600">·</span>
          <Link className="underline underline-offset-4" href="/contribute">
            Kontribusi
          </Link>
          <span className="mx-2 text-stone-600">·</span>
          <Link className="underline underline-offset-4" href="/about/ai">
            AI Transparency
          </Link>
          <span className="mx-2 text-stone-600">·</span>
          <Link className="underline underline-offset-4" href="/admin">
            Editorial
          </Link>
        </div>
      </div>
    </footer>
  );
}
