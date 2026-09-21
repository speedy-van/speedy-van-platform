import { AREAS } from "@/lib/areas";
import {
  SITE_LEGAL_NAME,
  SITE_OG_IMAGE,
  SITE_PHONE_E164,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo/constants";

type Schema = Record<string, unknown>;

export interface ServiceCatalogItem {
  name: string;
  description: string;
  url: string;
  startingFrom?: number | null;
  bookingDetail: string;
}

export function buildLocalBusinessSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_LEGAL_NAME,
    alternateName: "SpeedyVan",
    url: SITE_URL,
    telephone: SITE_PHONE_E164,
    image: SITE_OG_IMAGE,
    logo: SITE_OG_IMAGE,
    priceRange: "££",
    description:
      "Man and van, house removals, office relocations, furniture delivery and small moves across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressRegion: "Scotland",
    },
    areaServed: AREAS.map((area) => ({
      "@type": "AdministrativeArea",
      name: area.name,
    })),
    sameAs: [
      "https://www.facebook.com/share/1Dd8NQPV4f/?mibextid=wwXIfr",
      "https://www.tiktok.com/@speedyvan0",
      "https://wa.me/447909032889",
    ],
  };
}

export function buildServiceCatalogSchema(items: ServiceCatalogItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/#service-catalog`,
    name: "SpeedyVan moving service options",
    description:
      "House removals, furniture delivery, storage transport, office relocations and flexible man-and-van help across Scotland.",
    url: SITE_URL,
    itemListElement: items.map((item, index) => {
      const url = absoluteUrl(item.url);
      const offer: Schema = {
        "@type": "Offer",
        position: index + 1,
        name: item.name,
        url,
        priceCurrency: "GBP",
        itemOffered: {
          "@type": "Service",
          "@id": `${url}#service`,
          name: item.name,
          description: item.description,
          serviceType: item.name,
          provider: {
            "@type": "MovingCompany",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_LEGAL_NAME,
            url: SITE_URL,
          },
          areaServed: AREAS.map((area) => ({
            "@type": "AdministrativeArea",
            name: area.name,
          })),
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Booking flow",
              value: item.bookingDetail,
            },
          ],
          potentialAction: {
            "@type": "ReserveAction",
            target: url,
          },
        },
      };

      if (typeof item.startingFrom === "number") {
        offer.price = item.startingFrom;
        offer.description = `${item.description} From £${item.startingFrom}. ${item.bookingDetail}.`;
      }

      return offer;
    }),
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
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildServiceSchema(
  name: string,
  description: string,
  url: string,
  startingFrom?: number
): Schema {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(url),
    provider: {
      "@type": "MovingCompany",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_LEGAL_NAME,
      url: SITE_URL,
    },
    areaServed: AREAS.map((area) => ({
      "@type": "AdministrativeArea",
      name: area.name,
    })),
  };

  if (typeof startingFrom === "number") {
    schema.offers = {
      "@type": "Offer",
      price: startingFrom,
      priceCurrency: "GBP",
      url: absoluteUrl(url),
    };
  }

  return schema;
}
