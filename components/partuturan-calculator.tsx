"use client";

import { useMemo, useState } from "react";
import { inferKinshipTerm } from "@/lib/kinship-engine";
import type { KinshipRule } from "@/lib/types";

export function PartuturanCalculator({ rules }: { rules: KinshipRule[] }) {
  const contexts = [...new Set(rules.map((rule) => rule.culturalContext))];
  const [context, setContext] = useState<KinshipRule["culturalContext"]>(contexts[0] ?? "toba");
  const options = useMemo(() => rules.filter((rule) => rule.culturalContext === context), [context, rules]);
  const [relation, setRelation] = useState(options[0]?.relationCode ?? "");

  const safeRelation = options.some((item) => item.relationCode === relation)
    ? relation
    : options[0]?.relationCode ?? "";
  const result = inferKinshipTerm(context, safeRelation, rules);
  const activeRule = options.find((rule) => rule.relationCode === safeRelation);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form className="rounded-3xl border border-stone-200 bg-white p-6" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-semibold" htmlFor="culture-context">Konteks budaya</label>
        <select
          id="culture-context"
          value={context}
          onChange={(event) => {
            const next = event.target.value as KinshipRule["culturalContext"];
            setContext(next);
            const first = rules.find((rule) => rule.culturalContext === next);
            setRelation(first?.relationCode ?? "");
          }}
          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3"
        >
          {contexts.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <label className="mt-5 block text-sm font-semibold" htmlFor="relation">Hubungan yang sudah diketahui</label>
        <select
          id="relation"
          value={safeRelation}
          onChange={(event) => setRelation(event.target.value)}
          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3"
        >
          {options.map((rule) => <option key={rule.id} value={rule.relationCode}>{rule.relationLabelId}</option>)}
        </select>
        <p className="mt-4 text-xs leading-5 text-stone-500">
          Calculator meminta hubungan eksplisit. Ia tidak menentukan tutur hanya dari dua nama marga.
        </p>
      </form>

      <section aria-live="polite" className="rounded-3xl border border-stone-800 bg-stone-950 p-7 text-stone-100">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">Hasil source-aware</p>
        {result.status === "matched" ? (
          <>
            <p className="mt-4 font-serif text-5xl font-bold">{result.term}</p>
            <p className="mt-4 leading-7 text-stone-300">{result.explanation}</p>
            {activeRule?.caution ? <p className="mt-5 rounded-xl bg-white/5 p-4 text-sm leading-6 text-stone-300">⚠ {activeRule.caution}</p> : null}
            <p className="mt-5 text-xs text-stone-400">Rule: {result.ruleIds.join(", ")} · Source records: {result.sourceIds.join(", ") || "lihat database"}</p>
          </>
        ) : (
          <p className="mt-4 leading-7 text-stone-300">{result.explanation}</p>
        )}
      </section>
    </div>
  );
}
