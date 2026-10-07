import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MediaGallery } from "@/components/media-gallery";
import { PilotNotice } from "@/components/pilot-notice";
import { RelatedContent } from "@/components/related-content";
import { SourceList } from "@/components/source-list";
import { TraditionTimeline } from "@/components/tradition-timeline";
import {
  listDictionaryEntries,
  listMediaAssets,
  listTimelineSteps,
} from "@/lib/phase2-repository";
import {
  getPublishedEntity,
  listRelatedEntities,
  listSourcesForEntity,
} from "@/lib/repository";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getPublishedEntity(slug);
  if (!entity || entity.type === "clan") return {};
  return { title: entity.title, description: entity.summary };
}

export default async function KnowledgePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = await getPublishedEntity(slug);
  if (!entity || entity.type === "clan") notFound();

  const [sources, related, timeline, media, dictionary] = await Promise.all([
    listSourcesForEntity(entity),
    listRelatedEntities(entity),
    entity.type === "tradition" ? listTimelineSteps(entity.slug) : Promise.resolve([]),
    listMediaAssets(entity.slug),
    entity.type === "language_variety"
      ? listDictionaryEntries({ language: entity.slug })
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Explore", href: "/explore" }, { label: entity.title }]} />

      <header className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">{entity.type.replaceAll("_", " ")}</p>
        <h1 className="mt-3 font-serif text-6xl font-bold">{entity.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{entity.summary}</p>
        {(entity.type === "cultural_group" || entity.type === "region") ? (
          <Link href="/map" className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">Lihat di Cultural Map →</Link>
        ) : null}
      </header>

      <div className="mt-8"><PilotNotice>{entity.editorialNote}</PilotNotice></div>

      <article className="mt-10 space-y-10">
        {(entity.sections?.length ? entity.sections : [{ heading: "Tentang entri ini", body: "Struktur halaman sudah aktif, tetapi isi faktual mendalam hanya ditambahkan melalui source registry dan editorial review." }]).map((section) => (
          <section key={section.heading}><h2 className="font-serif text-3xl font-semibold">{section.heading}</h2><p className="mt-4 leading-8 text-stone-700">{section.body}</p></section>
        ))}

        {dictionary.length ? (
          <section><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Dictionary</p><h2 className="mt-1 font-serif text-3xl font-semibold">Contoh entri terverifikasi</h2></div><Link href={`/language?language=${entity.slug}`} className="text-sm font-semibold underline underline-offset-4">Buka dictionary →</Link></div><div className="mt-5 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">{dictionary.slice(0, 5).map((entry) => <div key={entry.id} className="grid gap-2 p-4 md:grid-cols-[10rem_1fr]"><div className="font-serif text-xl font-semibold">{entry.headword}</div><div><p className="font-medium">{entry.definitionId}</p><p className="text-xs text-stone-500">{entry.partOfSpeech ?? ""}</p></div></div>)}</div></section>
        ) : null}

        <TraditionTimeline steps={timeline} />

        {media.length ? <section><h2 className="font-serif text-3xl font-semibold">Media & rights</h2><div className="mt-5"><MediaGallery items={media} /></div></section> : null}

        <section><h2 className="font-serif text-3xl font-semibold">Sumber</h2><div className="mt-5"><SourceList sources={sources} /></div></section>
      </article>

      <RelatedContent items={related} />
    </div>
  );
}
