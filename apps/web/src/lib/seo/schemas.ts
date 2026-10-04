import { INDEXABLE_AREAS } from "@/lib/areas";
import { SITE } from "@speedy-van/config";
import {
  SITE_COMPANY_NUMBER,
  SITE_COMPANY_REGISTRY_URL,
  SITE_EMAIL,
  SITE_FOUNDING_DATE,
  SITE_LEGAL_NAME,
  SITE_NAME,
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

export interface AggregateRatingData {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}

export function buildLocalBusinessSchema(rating?: AggregateRatingData): Schema {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    alternateName: "Speedy Van",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Companies House",
      value: SITE_COMPANY_NUMBER,
    },
    url: SITE_URL,
    telephone: SITE_PHONE_E164,
    email: SITE_EMAIL,
    image: SITE_OG_IMAGE,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/logo-512.png"),
      width: 512,
      height: 512,
    },
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Bank Transfer, Credit Card",
    description:
      "Man and van, house removals, office relocations, furniture delivery and small moves across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond.",
    foundingDate: SITE_FOUNDING_DATE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Barrack Street",
      addressLocality: "Hamilton",
      postalCode: "ML3 0DG",
      addressRegion: "Scotland",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 55.7773,
      longitude: -4.0389,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: INDEXABLE_AREAS.map((area) => ({
      "@type": area.schemaType ?? "AdministrativeArea",
      name: area.name,
    })),
    sameAs: [
      SITE.social.facebook,
      SITE.social.tiktok,
      SITE_COMPANY_REGISTRY_URL,
    ],
    // TODO: add Google Business Profile and Trustpilot profile URLs after they are claimed.
  };

  if (rating && rating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
      bestRating: rating.bestRating ?? 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function buildWebsiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ["Speedy Van", "speedyvan.uk"],
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
      return {
        ...(typeof item.startingFrom === "number"
          ? buildGuideOffer(url, item.startingFrom, item.priceUnit)
          : { "@type": "Offer", url }),
        itemOffered: {
          "@type": "Service",
          "@id": `${url}#service`,
          name: item.name,
          description: item.description,
          url,
          provider: { "@id": `${SITE_URL}/#organization` },
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
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "AdministrativeArea", name: "Scotland" },
  };

  if (typeof startingFrom === "number") {
    schema.offers = buildGuideOffer(absoluteUrl(url), startingFrom, priceUnit);
  }

  return schema;
}
