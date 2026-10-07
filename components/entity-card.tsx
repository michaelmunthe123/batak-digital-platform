import Link from "next/link";
import type { KnowledgeEntity } from "@/lib/types";
import { hrefForEntity } from "@/lib/search-core";

const labels: Record<KnowledgeEntity["type"], string> = {
  cultural_group: "Kelompok budaya",
  clan: "Marga / Merga",
  region: "Wilayah",
  tradition: "Adat / Tradisi",
  kinship_system: "Sistem kekerabatan",
  kinship_term: "Partuturan",
  language_variety: "Bahasa",
  artifact: "Artefak",
  performance: "Seni pertunjukan",
  textile: "Tekstil",
  architecture: "Arsitektur",
  cuisine: "Kuliner",
};

export function EntityCard({ entity }: { entity: KnowledgeEntity }) {
  return (
    <article className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
        {labels[entity.type]}
      </p>
      <h3 className="mt-2 font-serif text-2xl font-semibold text-stone-950">
        <Link
          href={hrefForEntity(entity)}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950"
        >
          {entity.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600">{entity.summary}</p>
      <p className="mt-5 text-sm font-semibold text-stone-900 group-hover:underline">
        Jelajahi →
      </p>
    </article>
  );
}
