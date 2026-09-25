import { LOCAL_SERVICE_PAGES } from "@/lib/content/city-service-pages";

/** Link only to reviewed, routable city guides; never invent a city/service URL. */
export function localServiceHref(areaSlug: string, serviceSlug: string): string | undefined {
  const page = LOCAL_SERVICE_PAGES.find(
    (entry) => entry.areaSlug === areaSlug && entry.serviceSlug === serviceSlug
  );
  return page
    ? `/areas/${page.areaSlug}/${page.serviceSlug}`
    : undefined;
}
