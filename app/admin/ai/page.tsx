import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminAIReviewClient } from "@/components/admin-ai-review-client";
import { getEditorialState } from "@/lib/auth/editor";
import { getAISystemStatus } from "@/lib/ai-repository";

export const metadata: Metadata = { title: "AI Editorial Review" };

export default async function AdminAIPage() {
  const editorial = await getEditorialState();
  if (editorial.state === "anonymous") redirect("/admin/login");
  if (editorial.state !== "authorized") {
    return <div className="mx-auto max-w-4xl px-4 py-12"><h1 className="font-serif text-4xl font-semibold">AI Editorial</h1><p className="mt-4 text-stone-600">Akses editorial diperlukan.</p></div>;
  }
  const status = await getAISystemStatus();

  return (
    <div className="min-h-[70vh] bg-stone-100">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Human-in-the-loop</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold">AI Editorial Review</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Second-pass review untuk menemukan klaim yang belum terdukung. AI tidak dapat mengubah status publikasi.</p>
          </div>
          <Link href="/admin" className="text-sm font-semibold underline underline-offset-4">← Editorial dashboard</Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Stat label="AI configured" value={status.configured ? "Yes" : "No"} />
          <Stat label="Documents" value={String(status.publishedDocuments)} />
          <Stat label="Embedded" value={String(status.embeddedDocuments)} />
          <Stat label="Requests 7d" value={String(status.requests7d)} />
          <Stat label="Errors 7d" value={String(status.errors7d)} />
          <Stat label="Feedback + / -" value={`${status.positiveFeedback30d} / ${status.negativeFeedback30d}`} />
        </div>
        <div className="mt-8"><AdminAIReviewClient /></div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}
