import { describe, expect, it } from "vitest";
import { findGenealogyPath } from "@/lib/genealogy-engine";
import { pilotGenealogyGraph } from "@/lib/phase3-data";

describe("genealogy path engine", () => {
  it("finds a path only through explicit edges", () => {
    const result = findGenealogyPath(pilotGenealogyGraph, "demo-n1", "demo-n4");
    expect(result.status).toBe("found");
    expect(result.steps).toHaveLength(2);
  });

  it("ignores disputed edges", () => {
    const graph = {
      ...pilotGenealogyGraph,
      edges: [
        ...pilotGenealogyGraph.edges,
        {
          id: "disputed",
          datasetSlug: "demo-metodologi",
          sourceNodeId: "demo-n3",
          targetNodeId: "isolated",
          relation: "parent" as const,
          status: "disputed" as const,
          sourceIds: ["source-x"],
        },
      ],
      nodes: [
        ...pilotGenealogyGraph.nodes,
        {
          id: "isolated",
          datasetSlug: "demo-metodologi",
          label: "Isolated",
          generation: 2,
          livingStatus: "unknown" as const,
          visibility: "public" as const,
        },
      ],
    };
    expect(findGenealogyPath(graph, "demo-n3", "isolated").status).toBe("not_found");
  });
});
