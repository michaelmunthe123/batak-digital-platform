"use client";

import { useState } from "react";
import { AISourceCard } from "@/components/ai-source-card";
import type { AIRetrievedDocument, LearningPlanResult } from "@/lib/ai-types";

const topicOptions = ["marga", "adat", "bahasa", "partuturan", "sejarah", "wilayah"];

export function LearningPlanner() {
  const [topics, setTopics] = useState<string[]>(["adat"]);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [plan, setPlan] = useState<LearningPlanResult | null>(null);
  const [sources, setSources] = useState<AIRetrievedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleTopic(topic: string) {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : current.length < 5
          ? [...current, topic]
          : current,
    );
  }

  async function generate() {
    if (!topics.length) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/learning-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, level, language }),
      });
      const data = (await response.json()) as {
        plan?: LearningPlanResult;
        sources?: AIRetrievedDocument[];
        error?: string;
      };
      if (!response.ok || !data.plan) throw new Error(data.error || "Learning plan gagal dibuat.");
      setPlan(data.plan);
      setSources(data.sources ?? []);
    } catch (caught) {
      setPlan(null);
      setSources([]);
      setError(caught instanceof Error ? caught.message : "Learning plan gagal dibuat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
      <aside className="rounded-3xl border border-stone-200 bg-white p-6 lg:self-start">
        <h2 className="font-serif text-2xl font-semibold">Preferensi belajar</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">Personalisasi hanya berdasarkan pilihan di sesi ini; tidak membangun profil budaya pribadi.</p>
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Topik</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {topicOptions.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`rounded-full border px-3 py-2 text-sm ${topics.includes(topic) ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-white"}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block text-sm font-semibold">
          Level
          <select value={level} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setLevel(event.target.value as typeof level)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Bahasa
          <select value={language} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setLanguage(event.target.value === "en" ? "en" : "id")} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5">
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </label>
        <button onClick={generate} disabled={loading || !topics.length} className="mt-6 w-full rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Menyusun dari sumber…" : "Buat learning path"}
        </button>
        {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      </aside>

      <div aria-live="polite">
        {plan ? (
          <>
            <article className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Personalized learning path</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">{plan.title}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{plan.overview}</p>
              <ol className="mt-7 space-y-4">
                {plan.steps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className="rounded-2xl border border-stone-200 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Step {index + 1}</p>
                    <h3 className="mt-1 font-serif text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Tujuan:</strong> {step.objective}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600"><strong>Aktivitas:</strong> {step.activity}</p>
                    <p className="mt-2 text-xs text-stone-500">Sumber: {step.sourceKeys.join(", ") || "perlu evidence tambahan"}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-stone-950 p-5 text-stone-100">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Next question</p>
                <p className="mt-2 font-serif text-xl">{plan.nextQuestion}</p>
              </div>
              <p className="mt-5 text-sm leading-6 text-amber-900">{plan.caution}</p>
            </article>
            <section className="mt-6">
              <h2 className="font-serif text-2xl font-semibold">Referensi learning path</h2>
              <div className="mt-4 grid gap-3">{sources.map((source) => <AISourceCard key={source.id} source={source} />)}</div>
            </section>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-sm leading-7 text-stone-500">
            Pilih minat dan level. AI akan menyusun urutan belajar hanya dari knowledge base yang sudah terindeks dan bersumber.
          </div>
        )}
      </div>
    </div>
  );
}
