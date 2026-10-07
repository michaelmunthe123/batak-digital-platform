import type { MetadataRoute } from "next";
import { listPublishedEntities } from "@/lib/repository";
import { hrefForEntity } from "@/lib/search-core";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const entities = await listPublishedEntities();
  const staticRoutes = [
    "",
    "/explore",
    "/marga",
    "/adat",
    "/map",
    "/language",
    "/gallery",
    "/tarombo",
    "/tarombo/demo-metodologi",
    "/partuturan",
    "/relations",
    "/search",
    "/sources",
    "/about",
    "/about/methodology",
    "/contribute",
    "/contribute/guidelines",
    "/assistant",
    "/semantic-search",
    "/learn",
    "/about/ai",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...entities.map((entity) => ({
      url: `${base}${hrefForEntity(entity)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
