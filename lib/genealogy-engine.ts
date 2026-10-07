import type { GenealogyEdge, GenealogyGraph, GenealogyRelationType } from "@/lib/types";

type PathStep = {
  fromId: string;
  toId: string;
  relation: GenealogyRelationType | `inverse:${GenealogyRelationType}`;
  edgeId: string;
};

export type GenealogyPathResult = {
  status: "found" | "not_found";
  steps: PathStep[];
  note: string;
};

function neighbors(nodeId: string, edges: GenealogyEdge[]): PathStep[] {
  const steps: PathStep[] = [];
  for (const edge of edges) {
    if (edge.status === "draft" || edge.status === "disputed") continue;
    if (edge.sourceNodeId === nodeId) {
      steps.push({
        fromId: nodeId,
        toId: edge.targetNodeId,
        relation: edge.relation,
        edgeId: edge.id,
      });
    }
    if (edge.targetNodeId === nodeId) {
      steps.push({
        fromId: nodeId,
        toId: edge.sourceNodeId,
        relation: `inverse:${edge.relation}`,
        edgeId: edge.id,
      });
    }
  }
  return steps;
}

export function findGenealogyPath(
  graph: GenealogyGraph,
  fromId: string,
  toId: string,
  maxDepth = 8,
): GenealogyPathResult {
  if (fromId === toId) return { status: "found", steps: [], note: "Node yang sama." };

  const queue: Array<{ id: string; path: PathStep[] }> = [{ id: fromId, path: [] }];
  const seen = new Set([fromId]);

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.path.length >= maxDepth) continue;
    for (const step of neighbors(current.id, graph.edges)) {
      if (seen.has(step.toId)) continue;
      const path = [...current.path, step];
      if (step.toId === toId) {
        return {
          status: "found",
          steps: path,
          note: "Path dibentuk hanya dari edge non-draft/non-disputed yang tersimpan eksplisit.",
        };
      }
      seen.add(step.toId);
      queue.push({ id: step.toId, path });
    }
  }

  return {
    status: "not_found",
    steps: [],
    note: "Tidak ada path yang cukup pada dataset ini. Sistem tidak membuat hubungan baru secara spekulatif.",
  };
}
