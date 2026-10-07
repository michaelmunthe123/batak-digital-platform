import Link from "next/link";
import type { MediaAssetRecord } from "@/lib/types";

const rightsLabel: Record<MediaAssetRecord["rightsStatus"], string> = {
  cleared: "Cleared",
  public_domain: "Public domain",
  licensed: "Licensed",
  metadata_only: "Metadata only",
  unknown: "Unknown rights",
};

export function MediaGallery({ items }: { items: MediaAssetRecord[] }) {
  if (!items.length) return <p className="text-sm text-stone-500">Belum ada media yang lolos rights review.</p>;
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#f5ead7,#e5e7eb)] px-6 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{item.mediaType}</p>
              <p className="mt-2 font-serif text-xl font-semibold">{item.title}</p>
              {item.rightsStatus === "metadata_only" ? <p className="mt-2 text-xs text-stone-500">Preview intentionally withheld</p> : null}
            </div>
          </div>
          <div className="p-5">
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold">{rightsLabel[item.rightsStatus]}</span>
            {item.caption ? <p className="mt-4 text-sm leading-6 text-stone-600">{item.caption}</p> : null}
            <dl className="mt-4 space-y-2 text-xs">
              <div><dt className="text-stone-500">Rights holder</dt><dd className="font-medium">{item.rightsHolder ?? "Belum dicatat"}</dd></div>
              <div><dt className="text-stone-500">License</dt><dd className="font-medium">{item.license ?? "Belum dicatat"}</dd></div>
            </dl>
            {item.externalUrl ? <Link href={item.externalUrl} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Buka sumber media ↗</Link> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
