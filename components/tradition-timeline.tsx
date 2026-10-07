import type { TimelineStep } from "@/lib/types";

export function TraditionTimeline({ steps }: { steps: TimelineStep[] }) {
  if (!steps.length) return null;
  return (
    <section aria-labelledby="timeline-heading" className="mt-10 rounded-3xl border border-stone-200 bg-stone-50 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Phase 2 · source-aware</p>
      <h2 id="timeline-heading" className="mt-2 font-serif text-3xl font-semibold">Timeline adat</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Timeline hanya menampilkan tahapan yang sudah diberi konteks editorial. Ia bukan instruksi ritual universal.</p>
      <ol className="mt-7 space-y-5">
        {steps.map((step, index) => (
          <li key={step.id} className="grid grid-cols-[2.25rem_1fr] gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 text-sm font-bold text-white">{index + 1}</div>
            <div className="pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{step.stepType}</p>
              <h3 className="mt-1 font-serif text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
              {step.variationNote ? <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">Variasi: {step.variationNote}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
