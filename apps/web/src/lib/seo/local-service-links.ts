import { LOCAL_SERVICE_PAGES } from "@/lib/content/local-service-pages";

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
  "house-removal": ["flat-removals", "packing-service", "storage-transport"],
  "flat-removals": ["furniture-delivery", "house-removal", "storage-transport"],
  "furniture-delivery": ["storage-transport", "flat-removals", "packing-service"],
  "storage-transport": ["man-and-van", "student-move", "furniture-delivery"],
  "office-removal": ["business-removals", "packing-service", "furniture-delivery"],
  "business-removals": ["office-removal", "storage-transport", "man-and-van"],
  "man-and-van": ["small-moves", "furniture-delivery", "storage-transport"],
  "student-move": ["storage-transport", "flat-removals", "packing-service"],
  "small-moves": ["man-and-van", "furniture-delivery", "storage-transport"],
  "packing-service": ["house-removal", "flat-removals", "student-move"],
};

export function relatedLocalServiceLinks(areaSlug: string, serviceSlug: string) {
  return (COMPLEMENTARY_SERVICES[serviceSlug] ?? []).flatMap((relatedSlug) => {
    const page = LOCAL_SERVICE_PAGES.find(
      (entry) => entry.areaSlug === areaSlug && entry.serviceSlug === relatedSlug
    );
    return page ? [{ name: page.title, href: `/areas/${page.areaSlug}/${page.serviceSlug}` }] : [];
  });
}
