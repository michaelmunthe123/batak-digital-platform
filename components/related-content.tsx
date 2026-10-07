import { EntityCard } from "@/components/entity-card";
import type { KnowledgeEntity } from "@/lib/types";

export function RelatedContent({ items }: { items: KnowledgeEntity[] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="font-serif text-3xl font-semibold">
        Konten terkait
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((entity) => (
          <EntityCard key={entity.slug} entity={entity} />
        ))}
      </div>
    </section>
  );
}
