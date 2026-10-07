import type { Metadata } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
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
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
