import type { RelationshipEdge, RelationshipPath } from "@/lib/types";

export function findRelationshipPath(
  fromSlug: string,
  toSlug: string,
  edges: RelationshipEdge[],
  maxDepth = 5,
): RelationshipPath {
  if (!fromSlug || !toSlug) {
    return { status: "not_found", fromSlug, toSlug, edges: [], note: "Pilih dua entitas terlebih dahulu." };
  }
  if (fromSlug === toSlug) {
    return { status: "found", fromSlug, toSlug, edges: [], note: "Kedua pilihan menunjuk entitas yang sama." };
  }

  const queue: Array<{ slug: string; path: RelationshipEdge[] }> = [{ slug: fromSlug, path: [] }];
  const seen = new Set([fromSlug]);

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.path.length >= maxDepth) continue;

    const candidates = edges.filter(
      (edge) =>
        edge.status !== "draft" &&
        edge.status !== "disputed" &&
        (edge.sourceSlug === current.slug || edge.targetSlug === current.slug),
    );

    for (const edge of candidates) {
      const next = edge.sourceSlug === current.slug ? edge.targetSlug : edge.sourceSlug;
      if (seen.has(next)) continue;
      const path = [...current.path, edge];
      if (next === toSlug) {
        return {
          status: "found",
          fromSlug,
          toSlug,
          edges: path,
          note: "Path ini adalah jalur relasi terdokumentasi, bukan bukti bahwa dua individu tertentu memiliki hubungan darah.",
        };
      }
      seen.add(next);
      queue.push({ slug: next, path });
    }
  }

  return {
    status: "not_found",
    fromSlug,
    toSlug,
    edges: [],
    note: "Belum ada jalur source-aware yang diterbitkan di knowledge graph. Tidak ada inferensi berbasis kemiripan nama marga.",
  };
}
