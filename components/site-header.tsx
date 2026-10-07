import Link from "next/link";
import { SearchBox } from "@/components/search-box";

const nav = [
  { href: "/explore", label: "Explore" },
  { href: "/marga", label: "Marga" },
  { href: "/adat", label: "Adat" },
  { href: "/map", label: "Peta" },
  { href: "/language", label: "Bahasa" },
  { href: "/gallery", label: "Media" },
  { href: "/tarombo", label: "Tarombo" },
  { href: "/partuturan", label: "Partuturan" },
  { href: "/sources", label: "Sumber" },
  { href: "/assistant", label: "AI" },
  { href: "/contribute", label: "Kontribusi" },
  { href: "/about", label: "Tentang" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-[color:var(--paper)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-stone-950"
          >
            Batak Digital
          </Link>
          <span className="rounded-full border border-stone-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600">
            Phase 5
          </span>
        </div>

        <nav aria-label="Navigasi utama" className="lg:ml-8">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-stone-700">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:ml-auto lg:w-80">
          <SearchBox compact />
        </div>
      </div>
    </header>
  );
}
