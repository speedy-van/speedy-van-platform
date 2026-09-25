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

// Help visitors compare adjacent needs without producing unreviewed city URLs.
const COMPLEMENTARY_SERVICES: Record<string, readonly string[]> = {
  "house-removal": ["flat-removals", "packing-service"],
  "flat-removals": ["furniture-delivery", "house-removal"],
  "furniture-delivery": ["flat-removals", "packing-service"],
  "office-removal": ["packing-service", "furniture-delivery"],
  "student-move": ["flat-removals", "packing-service"],
  "packing-service": ["house-removal", "student-move"],
};

export function relatedLocalServiceLinks(areaSlug: string, serviceSlug: string) {
  return (COMPLEMENTARY_SERVICES[serviceSlug] ?? []).flatMap((relatedSlug) => {
    const page = LOCAL_SERVICE_PAGES.find(
      (entry) => entry.areaSlug === areaSlug && entry.serviceSlug === relatedSlug
    );
    return page ? [{ name: page.title, href: `/areas/${page.areaSlug}/${page.serviceSlug}` }] : [];
  });
}
