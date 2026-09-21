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
  bookingUrl: string;
  priceUnit?: "hour";
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

export function buildWebsiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_LEGAL_NAME,
    alternateName: "SpeedyVan",
    url: SITE_URL,
    inLanguage: "en-GB",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

function buildGuideOffer(url: string, price: number, priceUnit?: "hour"): Schema {
  const amount = new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", maximumFractionDigits: 0,
  }).format(price);

  return {
    "@type": "Offer",
    url,
    priceCurrency: "GBP",
    description: `Guide price from ${amount}${priceUnit === "hour" ? " per hour" : ""}. The final quote depends on the route, load, access and date.`,
    ...(priceUnit === "hour"
      ? { priceSpecification: {
          "@type": "UnitPriceSpecification",
          price,
          priceCurrency: "GBP",
          unitCode: "HUR",
          unitText: "hour",
        } }
      : { price }),
  };
}

export function buildServiceCatalogSchema(items: ServiceCatalogItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/#service-catalog`,
    name: "Moving services across Scotland",
    url: absoluteUrl("/services"),
    itemListElement: items.map((item) => {
      const url = absoluteUrl(item.url);
      const service = buildServiceSchema(item.name, item.description, url);
      delete service["@context"];
      return {
        ...(typeof item.startingFrom === "number"
          ? buildGuideOffer(url, item.startingFrom, item.priceUnit)
          : { "@type": "Offer", url }),
        itemOffered: {
          ...service,
          potentialAction: {
            "@type": "ReserveAction",
            target: absoluteUrl(item.bookingUrl),
          },
        },
      };
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
  startingFrom?: number,
  priceUnit?: "hour"
): Schema {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(url)}#service`,
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
    schema.offers = buildGuideOffer(absoluteUrl(url), startingFrom, priceUnit);
  }

  return schema;
}
