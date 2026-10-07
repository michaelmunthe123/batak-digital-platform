"use client";

import { useMemo, useState } from "react";
import type { GenealogyGraph } from "@/lib/types";

export function GenealogyTree({ graph }: { graph: GenealogyGraph }) {
  const [selectedId, setSelectedId] = useState(graph.nodes[0]?.id ?? "");
  const generations = useMemo(() => {
    const values = [...new Set(graph.nodes.map((node) => node.generation))].sort((a, b) => a - b);
    return values.map((generation) => ({
      generation,
      nodes: graph.nodes.filter((node) => node.generation === generation),
    }));
  }, [graph.nodes]);
  const selected = graph.nodes.find((node) => node.id === selectedId);
  const connected = graph.edges.filter(
    (edge) => edge.sourceNodeId === selectedId || edge.targetNodeId === selectedId,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_19rem]">
      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white p-5">
        <div className="min-w-[42rem] space-y-8">
          {generations.map(({ generation, nodes }) => (
            <section key={generation} aria-label={`Generasi ${generation + 1}`}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Generasi {generation + 1}
              </p>
              <div className="flex flex-wrap gap-3">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    className={`min-w-44 rounded-2xl border p-4 text-left transition ${
                      selectedId === node.id
                        ? "border-stone-900 bg-stone-950 text-white"
                        : "border-stone-200 bg-stone-50 hover:border-stone-400"
                    }`}
                  >
                    <span className="block font-serif text-lg font-semibold">{node.label}</span>
                    <span className={`mt-2 block text-xs ${selectedId === node.id ? "text-stone-300" : "text-stone-500"}`}>
                      {node.livingStatus} · {node.visibility}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Node inspector</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold">{selected?.label ?? "Pilih node"}</h2>
        {selected ? (
          <>
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-stone-500">Generasi</dt><dd className="font-medium">{selected.generation + 1}</dd></div>
              <div><dt className="text-stone-500">Living status</dt><dd className="font-medium">{selected.livingStatus}</dd></div>
              <div><dt className="text-stone-500">Visibility</dt><dd className="font-medium">{selected.visibility}</dd></div>
            </dl>
            <div className="mt-6">
              <p className="text-sm font-semibold">Relasi eksplisit</p>
              {connected.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {connected.map((edge) => {
                    const otherId = edge.sourceNodeId === selected.id ? edge.targetNodeId : edge.sourceNodeId;
                    const other = graph.nodes.find((node) => node.id === otherId);
                    return (
                      <li key={edge.id} className="rounded-xl border border-stone-200 bg-white p-3">
                        <span className="font-medium">{edge.relation}</span> · {other?.label ?? otherId}
                        <span className="mt-1 block text-xs text-stone-500">status: {edge.status}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="mt-2 text-sm text-stone-500">Tidak ada edge untuk node ini.</p>}
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}
