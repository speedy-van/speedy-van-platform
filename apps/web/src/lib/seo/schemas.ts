import { AREAS } from "@/lib/areas";

const SITE_URL = "https://speedyvan.uk";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const PHONE = "+44 1202 129746";

type Schema = Record<string, unknown>;

export function buildLocalBusinessSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "SpeedyVan",
    url: SITE_URL,
    telephone: PHONE,
    image: OG_IMAGE,
    logo: OG_IMAGE,
    priceRange: "££",
    description:
      "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressRegion: "Scotland",
    },
    areaServed: AREAS.map((area) => ({
      "@type": "City",
      name: area.name,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://www.facebook.com/share/1Dd8NQPV4f/?mibextid=wwXIfr",
      "https://www.tiktok.com/@speedyvan0",
      "https://wa.me/message/J6EO772GDPHFO1",
    ],
  };
}

export function buildFaqSchema(
  faqs: { question: string; answer: string }[]
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildServiceSchema(
  name: string,
  description: string,
  url: string
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: "SpeedyVan",
      url: SITE_URL,
    },
    areaServed: AREAS.map((area) => ({
      "@type": "City",
      name: area.name,
    })),
  };
}
