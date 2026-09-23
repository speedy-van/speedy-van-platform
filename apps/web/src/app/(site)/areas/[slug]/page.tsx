import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, getAreaBySlug } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { SITE_LEGAL_NAME, SITE_OG_IMAGE, SITE_URL, absoluteUrl } from "@/lib/seo/constants";

interface Props {
  params: { slug: string };
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getAreaBySlug(params.slug);
  if (!area) {
    return {
      title: "Area Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = absoluteUrl(`/areas/${params.slug}`);

  return {
    title: area.headline,
    description: area.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${area.headline} | SpeedyVan`,
      description: area.metaDescription,
      url: canonical,
      images: [
        {
          url: SITE_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${area.headline} – SpeedyVan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${area.headline} | SpeedyVan`,
      description: area.metaDescription,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default function AreaPage({ params }: Props) {
  const area = getAreaBySlug(params.slug);
  if (!area) notFound();

  const nearbyAreaData = area.nearbyAreas
    .map((slug) => AREAS.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        id={`area-breadcrumb-${params.slug}`}
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Areas", url: "/#areas" },
            { name: area.name, url: `/areas/${params.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${area.name} man and van and removals`,
            description: area.metaDescription,
            url: absoluteUrl(`/areas/${params.slug}`),
            provider: {
              "@type": "MovingCompany",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_LEGAL_NAME,
              url: SITE_URL,
            },
            areaServed: {
              "@type": "AdministrativeArea",
              name: area.name,
              address: {
                "@type": "PostalAddress",
                postalCode: area.postcode,
                addressRegion: area.region,
                addressCountry: "GB",
              },
            },
          },
        ]}
      />
      {/* Hero */}
      <section
        className="text-white py-16 lg:py-24"
        style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#areas" className="hover:text-white transition-colors">
                  Areas
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                {area.name}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 text-amber-300 text-sm font-medium mb-4">
              <span aria-hidden="true">📍</span>
              <span>{area.region}</span>
              {area.postcode && (
                <span className="text-amber-400/70">· {area.postcode}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
              {area.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {area.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {area.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-amber-900/30"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.70)" }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-black text-black transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
              >
                Start an Online Quote
              </Link>
              <a
                href="tel:07909032889"
                aria-label="Call us on 07909 032889"
                className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
              >
                <img src="/call-icon.png" alt="Call us" width={52} height={52} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services in this area */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="area-services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="area-services-heading" className="text-2xl font-black text-white mb-8">
            Services Available in {area.name}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" role="list">
            {SERVICES.filter((service) => service.indexable !== false).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-amber-900/20 transition-all hover:border-amber-400/40"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white group-hover:text-amber-400 truncate transition-colors">
                      {service.name}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                      From {money.format(service.startingFrom)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why SpeedyVan in this area */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
        aria-labelledby="why-us-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="why-us-heading" className="text-2xl font-black text-white mb-6">
              Why Choose SpeedyVan in {area.name}?
            </h2>
            {area.moveAdvice?.length ? (
              <div className="grid gap-4">
                {area.moveAdvice.map((point) => (
                  <article
                    key={point.title}
                    className="rounded-xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    <h3 className="font-black text-white">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {point.body}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Moving in {area.name} works best when access is clear before
                  the van arrives. Tell us about stairs, lifts, parking limits,
                  loading bays, narrow streets, and any timed handover so we can
                  recommend the right vehicle, crew size, and time allowance.
                </p>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Whether you&apos;re moving a single piece of furniture or
                  relocating a full home or business, our {area.name} quote is
                  based on the real job details: volume, access, mileage, crew
                  time, parking, and any packing or dismantling support you need.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  You can start online for straightforward moves, or call the
                  team if the job has unusual access, heavy items, a long route,
                  or several collection and delivery points.
                </p>
              </div>
            )}

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
              {[
                "Goods-in-transit cover included as standard",
                "Clear quote before booking",
                "Access and parking details checked",
                "Same-day bookings when available",
                "Useful for homes, flats, furniture, and business moves",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.70)" }}>
                  <svg
                    className="w-5 h-5 text-amber-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Nearby areas */}
      {nearbyAreaData.length > 0 && (
        <section
          className="py-16"
          style={{ background: "#0A0A0A" }}
          aria-labelledby="nearby-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="nearby-heading" className="text-2xl font-black text-white mb-6">
              Also Covering Nearby Areas
            </h2>
            <ul className="flex flex-wrap gap-3" role="list">
              {nearbyAreaData.map((nearby) => (
                <li key={nearby.slug}>
                  <Link
                    href={`/areas/${nearby.slug}`}
                    className="inline-block px-4 py-2 rounded-lg border border-amber-900/20 text-sm font-medium transition-all hover:border-amber-400/40 hover:text-amber-400"
                    style={{ color: "rgba(255,255,255,0.70)" }}
                  >
                    {nearby.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-black leading-tight text-balance text-white sm:text-3xl">
            Book Your {area.name} Move Today
          </h2>
          <p className="mt-3 text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
            Instant quotes · Transparent pricing · Professional drivers
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-black text-black transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Start Online Quote
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <img src="/call-icon.png" alt="Call us" width={52} height={52} />
            </a>
            <a
              href="mailto:hello@speedyvan.uk"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-4 font-bold text-white hover:bg-white/5 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
