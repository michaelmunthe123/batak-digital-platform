import Link from "next/link";
import {
  transitionClaimStatus,
  transitionEntityStatus,
  transitionSourceStatus,
  transitionGenealogyDatasetStatus,
  transitionGenealogyEdgeStatus,
  transitionKinshipRuleStatus,
} from "@/app/admin/actions";
import { signOut } from "@/app/admin/login/actions";
import { getEditorialSnapshot } from "@/lib/admin-data";
import { getEditorialState } from "@/lib/auth/editor";

export default async function AdminPage() {
  const editorial = await getEditorialState();

  if (editorial.state === "unconfigured") {
    return (
      <AdminShell>
        <h1 className="font-serif text-4xl font-bold">Editorial workspace</h1>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-950">
          <p className="font-semibold">Supabase belum terhubung.</p>
          <p className="mt-2">
            Workflow sudah siap. Ikuti docs/05-local-setup.md untuk migration,
            seed, user Auth, dan role pada public.profiles.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (editorial.state === "anonymous") {
    return (
      <AdminShell>
        <h1 className="font-serif text-4xl font-bold">Editorial workspace</h1>
        <p className="mt-4 text-stone-600">Silakan login untuk melanjutkan.</p>
        <Link href="/admin/login" className="mt-6 inline-block rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white">
          Login
        </Link>
      </AdminShell>
    );
  }

  if (editorial.state === "forbidden") {
    return (
      <AdminShell>
        <h1 className="font-serif text-4xl font-bold">Akses belum diberikan</h1>
        <p className="mt-4 text-stone-600">
          User {editorial.email ?? ""} sudah terautentikasi tetapi belum memiliki
          role editorial pada public.profiles.
        </p>
        <form action={signOut} className="mt-6">
          <button className="underline underline-offset-4">Keluar</button>
        </form>
      </AdminShell>
    );
  }

  const snapshot = await getEditorialSnapshot();

  return (
    <AdminShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">
            {editorial.role}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Editorial workspace</h1>
          <p className="mt-2 text-sm text-stone-600">{editorial.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold">
            Keluar
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/completeness" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">Content completeness</Link>
        <Link href="/admin/community" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">Community moderation</Link>
        <Link href="/admin/ai" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">AI review</Link>
        {editorial.role !== "reviewer" ? (
          <>
            <Link href="/admin/content/new" className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">
              + Entity
            </Link>
            <Link href="/admin/sources/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">
              + Source
            </Link>
            <Link href="/admin/claims/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">
              + Sourced claim
            </Link>
            <Link href="/admin/genealogy/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">+ Genealogy dataset</Link>
            <Link href="/admin/genealogy/nodes/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">+ Genealogy node</Link>
            <Link href="/admin/genealogy/edges/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">+ Genealogy edge</Link>
            <Link href="/admin/kinship-rules/new" className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold">+ Kinship rule</Link>
          </>
        ) : null}
      </div>

      <Queue
        title="Entities"
        rows={snapshot.entities}
        role={editorial.role}
        kind="entity"
      />
      <Queue
        title="Sources"
        rows={snapshot.sources}
        role={editorial.role}
        kind="source"
      />

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-semibold">Phase 3 genealogy review</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <ReviewPanel title="Genealogy datasets">
            {snapshot.genealogyDatasets.length ? snapshot.genealogyDatasets.map((row) => (
              <article key={row.id} className="rounded-xl border border-stone-200 p-4">
                <p className="font-medium">{row.title}</p><p className="mt-1 text-xs text-stone-500">{row.visibility} · {row.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">{["draft","in_review","published"].map(status => <form key={status} action={transitionGenealogyDatasetStatus}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="status" value={status}/><button className="rounded-lg border px-2 py-1 text-xs">{status}</button></form>)}</div>
              </article>
            )) : <EmptyQueue/>}
          </ReviewPanel>
          <ReviewPanel title="Genealogy edges">
            {snapshot.genealogyEdges.length ? snapshot.genealogyEdges.map((row) => (
              <article key={row.id} className="rounded-xl border border-stone-200 p-4">
                <p className="font-medium">{row.relation}</p><p className="mt-1 text-xs text-stone-500">{row.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">{["draft","supported","verified","regional_variation","disputed"].map(status => <form key={status} action={transitionGenealogyEdgeStatus}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="status" value={status}/><button className="rounded-lg border px-2 py-1 text-xs">{status}</button></form>)}</div>
              </article>
            )) : <EmptyQueue/>}
          </ReviewPanel>
          <ReviewPanel title="Kinship rules">
            {snapshot.kinshipRules.length ? snapshot.kinshipRules.map((row) => (
              <article key={row.id} className="rounded-xl border border-stone-200 p-4">
                <p className="font-medium">{row.term}</p><p className="mt-1 text-xs text-stone-500">{row.cultural_context} · {row.status} · {row.publication_status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={transitionKinshipRuleStatus}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="claim_status" value="supported"/><input type="hidden" name="publication_status" value="published"/><button className="rounded-lg border px-2 py-1 text-xs">publish supported</button></form>
                  <form action={transitionKinshipRuleStatus}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="claim_status" value="verified"/><input type="hidden" name="publication_status" value="published"/><button className="rounded-lg border px-2 py-1 text-xs">publish verified</button></form>
                  <form action={transitionKinshipRuleStatus}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="claim_status" value="draft"/><input type="hidden" name="publication_status" value="draft"/><button className="rounded-lg border px-2 py-1 text-xs">return draft</button></form>
                </div>
              </article>
            )) : <EmptyQueue/>}
          </ReviewPanel>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-semibold">Claims</h2>
        <div className="mt-5 space-y-3">
          {snapshot.claims.length ? snapshot.claims.map((claim) => (
            <article key={claim.id} className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm leading-6 text-stone-800">{claim.body}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{claim.status}</p>
              {(editorial.role === "reviewer" || editorial.role === "admin") ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {["supported","verified","regional_variation","disputed","community_sourced","draft"].map((status) => (
                    <form key={status} action={transitionClaimStatus}>
                      <input type="hidden" name="id" value={claim.id} />
                      <input type="hidden" name="status" value={status} />
                      <button className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold">
                        {status}
                      </button>
                    </form>
                  ))}
                </div>
              ) : null}
            </article>
          )) : <EmptyQueue />}
        </div>
      </section>
    </AdminShell>
  );
}

type QueueRow = {
  id: string;
  title: string;
  status: string;
  type?: string;
  level?: string;
};

function Queue({
  title,
  rows,
  role,
  kind,
}: {
  title: string;
  rows: QueueRow[];
  role: "admin" | "editor" | "reviewer";
  kind: "entity" | "source";
}) {
  const action = kind === "entity" ? transitionEntityStatus : transitionSourceStatus;
  const statuses =
    role === "admin"
      ? ["draft", "in_review", "published", "archived"]
      : role === "editor"
        ? ["draft", "in_review"]
        : ["draft", "published"];

  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl font-semibold">{title}</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        {rows.length ? (
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Type/Level</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-4 font-medium">{row.title}</td>
                  <td className="px-5 py-4 text-stone-500">{row.type ?? row.level ?? "—"}</td>
                  <td className="px-5 py-4">{row.status}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <form key={status} action={action}>
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="status" value={status} />
                          <button className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-semibold">
                            {status}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-5"><EmptyQueue /></div>
        )}
      </div>
    </section>
  );
}


function ReviewPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="font-serif text-xl font-semibold">{title}</h3><div className="mt-4 space-y-3">{children}</div></div>;
}

function EmptyQueue() {
  return <p className="text-sm text-stone-500">Belum ada item.</p>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">{children}</div>
    </div>
  );
}
