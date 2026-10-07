import type { Metadata } from "next";
import { LearningPlanner } from "@/components/learning-planner";

export const metadata: Metadata = {
  title: "Personalized Learning",
  description: "Learning path budaya Batak yang disusun dari knowledge base bersumber.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Source-grounded learning</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Belajar budaya secara bertahap</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
        Pilih topik dan level. AI menyusun urutan belajar dari dokumen yang telah dipublikasikan, bukan membuat silabus berdasarkan asumsi model.
      </p>
      <div className="mt-9"><LearningPlanner /></div>
    </div>
  );
}
