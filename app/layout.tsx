import type { Metadata } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { hasSupabaseEnv } from "@/lib/env";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Batak Digital Knowledge Platform",
    template: "%s | Batak Digital",
  },
  description:
    "Platform pengetahuan budaya Batak yang terstruktur, bersumber, dan menghormati variasi antarwilayah serta tradisi.",
  openGraph: {
    title: "Batak Digital Knowledge Platform",
    description:
      "Jelajahi marga, adat, wilayah, bahasa, dan sumber budaya Batak.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a
          href="#main-content"
          className="sr-only sr-only-focusable"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        {!hasSupabaseEnv() && (
          <aside aria-label="Status layanan" className="bg-amber-50 px-4 py-3 text-center text-sm text-stone-800">
            Mode pilot: konten contoh untuk eksplorasi. Database, login, dan kontribusi belum tersedia.
            Tarombo demo bersifat fiktif, bukan silsilah keluarga nyata.
          </aside>
        )}
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
