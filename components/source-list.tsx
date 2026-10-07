import type { SourceRecord } from "@/lib/types";

export function SourceList({ sources }: { sources: SourceRecord[] }) {
  if (!sources.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm leading-6 text-stone-600">
        Belum ada sumber khusus untuk entri ini. Konten faktual mendalam tidak
        diterbitkan sampai proses verifikasi selesai.
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {sources.map((source) => (
        <li
          key={source.id}
          className="rounded-2xl border border-stone-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
            <span>Level {source.level}</span>
            <span aria-hidden="true">•</span>
            <span>{source.type.replace("_", " ")}</span>
          </div>
          <p className="mt-2 font-semibold text-stone-950">{source.title}</p>
          <p className="mt-1 text-sm text-stone-600">
            {[source.creator, source.publisher, source.year]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {source.description}
          </p>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-stone-950 underline underline-offset-4"
            >
              Buka sumber ↗
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
