import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PilotNotice } from "@/components/pilot-notice";
import { RelatedContent } from "@/components/related-content";
import { SourceList } from "@/components/source-list";
import { getPublishedEntity, listRelatedEntities, listSourcesForEntity } from "@/lib/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getPublishedEntity(slug);
  if (!entity || entity.type !== "clan") return {};
  return {
    title: entity.title,
    description: entity.summary,
  };
}

export default async function ClanProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = await getPublishedEntity(slug);
  if (!entity || entity.type !== "clan") notFound();

  const [sources, related] = await Promise.all([
    listSourcesForEntity(entity),
    listRelatedEntities(entity),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marga", href: "/marga" },
          { label: entity.title },
        ]}
      />

      <header className="mt-8 border-b border-stone-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">
          Marga / Merga
        </p>
        <h1 className="mt-3 font-serif text-6xl font-bold">{entity.title}</h1>
        {entity.aliases?.length ? (
          <p className="mt-3 text-sm text-stone-500">
            Alias/ejaan alternatif: {entity.aliases.join(", ")}
          </p>
        ) : null}
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
          {entity.summary}
        </p>
      </header>

      <div className="mt-8">
        <PilotNotice>{entity.editorialNote}</PilotNotice>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <article className="space-y-10">
          <section>
            <h2 className="font-serif text-3xl font-semibold">Overview</h2>
            <p className="mt-4 leading-8 text-stone-700">
              Struktur profil sudah disiapkan untuk overview, asal-usul, tradisi
              genealogis, wilayah, hubungan, variasi, dan sumber. Pada Phase 1,
              kolom yang belum memiliki sumber terverifikasi tidak diisi dengan
              klaim spekulatif.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-semibold">Asal & tarombo</h2>
            <p className="mt-4 leading-8 text-stone-700">
              Phase 3 sudah menyediakan model tarombo source-aware, privacy rule, dan visualizer. Namun tarombo marga ini tetap belum dipublikasikan sampai dataset khusus entri ini memiliki sumber yang memadai dan lolos review.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-semibold">Tools Phase 3</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/tarombo" className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold">Tarombo Visualizer</a>
              <a href="/relations" className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold">Relationship Explorer</a>
              <a href="/partuturan" className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold">Partuturan Calculator</a>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-semibold">
              Variasi & perbedaan sumber
            </h2>
            <p className="mt-4 leading-8 text-stone-700">
              Jika sumber yang kredibel mendokumentasikan versi berbeda,
              platform akan menampilkan konteks masing-masing versi alih-alih
              menghapus salah satunya.
            </p>
          </section>

          <section aria-labelledby="source-heading">
            <h2 id="source-heading" className="font-serif text-3xl font-semibold">
              Sumber
            </h2>
            <div className="mt-5">
              <SourceList sources={sources} />
            </div>
          </section>
        </article>

        <aside>
          <div className="sticky top-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold">Metadata pilot</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-stone-500">Tipe internal</dt>
                <dd className="mt-1 font-medium">Clan</dd>
              </div>
              <div>
                <dt className="text-stone-500">Istilah lokal</dt>
                <dd className="mt-1 font-medium">
                  {entity.localTerm ?? "Belum ditetapkan"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Cultural group</dt>
                <dd className="mt-1 font-medium">
                  {entity.culturalGroup ?? "Perlu sumber khusus"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Status</dt>
                <dd className="mt-1 font-medium">Pilot / editorial review</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <RelatedContent items={related} />
    </div>
  );
}
