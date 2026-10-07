export function PilotNotice({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
      <p className="font-semibold">Catatan editorial Phase 1</p>
      <div className="mt-1">
        {children ??
          "Entri ini masih berada pada tahap pilot. Informasi yang belum memiliki sumber khusus sengaja tidak diterbitkan sebagai fakta."}
      </div>
    </aside>
  );
}
