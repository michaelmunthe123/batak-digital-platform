import Link from "next/link";
import type { RelationshipPath as RelationshipPathType } from "@/lib/types";

export function RelationshipPath({ path }: { path: RelationshipPathType }) {
  if (path.status === "not_found") {
    return <div className="rounded-2xl border border-dashed border-stone-300 p-5 text-sm leading-6 text-stone-600">{path.note}</div>;
  }
  if (!path.edges.length) {
    return <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm">{path.note}</div>;
  }
  return (
    <div>
      <ol className="space-y-3">
        {path.edges.map((edge, index) => (
          <li key={edge.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Step {index + 1} · {edge.status}</p>
            <p className="mt-2 font-medium">
              <Link className="underline underline-offset-4" href={`/knowledge/${edge.sourceSlug}`}>{edge.sourceSlug}</Link>
              <span className="mx-2 text-stone-400">→</span>
              {edge.label}
              <span className="mx-2 text-stone-400">→</span>
              <Link className="underline underline-offset-4" href={`/knowledge/${edge.targetSlug}`}>{edge.targetSlug}</Link>
            </p>
            {edge.contextNote ? <p className="mt-2 text-sm leading-6 text-stone-600">{edge.contextNote}</p> : null}
            <p className="mt-2 text-xs text-stone-500">Sources: {edge.sourceIds.length ? edge.sourceIds.join(", ") : "source link not loaded"}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-6 text-stone-600">{path.note}</p>
    </div>
  );
}
