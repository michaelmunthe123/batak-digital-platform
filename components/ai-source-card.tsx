import Link from "next/link";
import type { AIRetrievedDocument } from "@/lib/ai-types";

export function AISourceCard({ source }: { source: AIRetrievedDocument }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
            {source.sourceKey ?? "Source"}
          </p>
          <h3 className="mt-1 font-semibold text-stone-900">{source.sourceTitle}</h3>
        </div>
        <span className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-semibold text-stone-600">
          {source.documentType.replaceAll("_", " ")}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">{source.title}</p>
      {source.citationLocator ? (
        <p className="mt-2 text-xs text-stone-500">Locator: {source.citationLocator}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
        {source.entitySlug ? (
          <Link
            href={source.entityType === "clan" ? `/marga/${source.entitySlug}` : `/knowledge/${source.entitySlug}`}
            className="underline underline-offset-4"
          >
            Lihat knowledge entry
          </Link>
        ) : null}
        {source.sourceUrl ? (
          <a
            href={source.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Buka sumber ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}
