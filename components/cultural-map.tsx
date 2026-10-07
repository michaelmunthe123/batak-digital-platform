"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MapLocation } from "@/lib/types";

const bounds = { minLat: 0.5, maxLat: 3.8, minLng: 97.8, maxLng: 100.2 };

function project(point: MapLocation) {
  const x = ((point.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = (1 - (point.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
  return { x: Math.max(3, Math.min(97, x)), y: Math.max(3, Math.min(97, y)) };
}

export function CulturalMap({ points }: { points: MapLocation[] }) {
  const groups = useMemo(
    () => ["Semua", ...Array.from(new Set(points.map((p) => p.culturalGroup).filter(Boolean)))],
    [points],
  );
  const [group, setGroup] = useState("Semua");
  const [selectedId, setSelectedId] = useState(points[0]?.id ?? "");
  const visible = points.filter((p) => group === "Semua" || p.culturalGroup === group);
  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter cultural group">
          {groups.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { setGroup(item!); setSelectedId(""); }}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${group === item ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-white"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-300 bg-[radial-gradient(circle_at_30%_20%,#f5dfb7,transparent_30%),linear-gradient(145deg,#e7efe8,#f8f1e3_55%,#e8ded0)]" role="img" aria-label="Peta skematik titik navigasi budaya Sumatera Utara">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(#78716c33 1px,transparent 1px),linear-gradient(90deg,#78716c33 1px,transparent 1px)", backgroundSize: "10% 10%" }} />
          <div className="absolute left-5 top-5 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm">N ↑ · Cultural atlas schematic</div>
          <div className="absolute bottom-4 left-4 max-w-sm rounded-xl bg-white/90 px-3 py-2 text-[11px] leading-5 text-stone-600 shadow-sm">
            Titik bersifat representatif dan tidak mendefinisikan batas budaya, etnik, atau wilayah tutur.
          </div>
          {visible.map((point) => {
            const pos = project(point);
            const active = selected?.id === point.id;
            return (
              <button
                key={point.id}
                type="button"
                aria-label={`Pilih ${point.title}`}
                onClick={() => setSelectedId(point.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition ${active ? "h-6 w-6 bg-stone-950" : "h-4 w-4 bg-amber-700 hover:scale-125"}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              />
            );
          })}
        </div>
      </div>

      <aside className="rounded-3xl border border-stone-200 bg-white p-6">
        {selected ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">{selected.precision} point</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">{selected.title}</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">{selected.note}</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-stone-500">Koordinat referensi</dt><dd className="font-medium">{selected.latitude.toFixed(2)}, {selected.longitude.toFixed(2)}</dd></div>
              <div><dt className="text-stone-500">Tipe</dt><dd className="font-medium">{selected.entityType.replaceAll("_", " ")}</dd></div>
            </dl>
            <Link href={selected.entityType === "clan" ? `/marga/${selected.entitySlug}` : `/knowledge/${selected.entitySlug}`} className="mt-6 inline-block font-semibold underline underline-offset-4">Buka entri →</Link>
          </>
        ) : <p className="text-sm text-stone-500">Tidak ada titik pada filter ini.</p>}
      </aside>
    </div>
  );
}
