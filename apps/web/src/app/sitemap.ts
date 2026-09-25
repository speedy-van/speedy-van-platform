import type { MetadataRoute } from "next";
import { AREAS } from "@/lib/areas";
import { LOCAL_SERVICE_PAGES } from "@/lib/content/city-service-pages";
import { MOVING_ROUTE_PAGES } from "@/lib/content/moving-route-pages";
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
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/areas", changeFrequency: "weekly", priority: 0.9 },
  { path: "/moving-routes", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.7 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/man-and-van-or-house-removals", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

// Actual content review dates, not the build time or a claim about Google indexing.
const contentUpdatedAt: Record<string, string> = {
  "/areas/glasgow": "2026-09-25",
  "/areas/aberdeen": "2026-09-25",
  "/areas/inverness": "2026-09-25",
  "/areas/edinburgh": "2026-09-25",
  "/areas/edinburgh/student-move": "2026-09-25",
  "/pricing": "2026-09-25",
};

function sitemapEntry({ path, changeFrequency, priority }: SitemapPage): SitemapEntry {
  return {
    url: absoluteUrl(path),
    ...(contentUpdatedAt[path] ? { lastModified: contentUpdatedAt[path] } : {}),
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
    ...LOCAL_SERVICE_PAGES.map((page): SitemapPage => ({ path: `/areas/${page.areaSlug}/${page.serviceSlug}`, changeFrequency: "monthly", priority: 0.7 })),
    ...MOVING_ROUTE_PAGES.map((page): SitemapPage => ({ path: `/moving-routes/${page.slug}`, changeFrequency: "monthly", priority: 0.7 })),
  ].map(sitemapEntry);
}
