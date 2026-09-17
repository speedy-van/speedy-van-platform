import type { MetadataRoute } from "next";
import { AREAS } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { absoluteUrl } from "@/lib/seo/constants";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

interface SitemapPage {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const staticPages: SitemapPage[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

function sitemapEntry({ path, changeFrequency, priority }: SitemapPage): SitemapEntry {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const areaPages: SitemapPage[] = AREAS.map((area) => ({
    path: `/areas/${area.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const servicePages: SitemapPage[] = SERVICES.filter(
    (service) => service.indexable !== false
  ).map((service) => ({
    path: `/services/${service.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const internationalPages: SitemapPage[] = [
    {
      path: "/services/european-removals",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [
    ...staticPages,
    ...areaPages,
    ...servicePages,
    ...internationalPages,
  ].map(sitemapEntry);
}
