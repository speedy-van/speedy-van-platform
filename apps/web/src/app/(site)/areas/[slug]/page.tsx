import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, getAreaBySlug } from "@/lib/areas";
import { getAreaGuide } from "@/lib/area-guides";
import { AreaExpansionLinks } from "@/components/areas/AreaExpansionLinks";
import { AreaGuideContent } from "@/components/areas/AreaGuideContent";
import { SERVICES, getServicePriceLabel } from "@/lib/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_LEGAL_NAME, SITE_OG_IMAGE, SITE_URL, absoluteUrl } from "@/lib/seo/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) {
    return {
      title: "Area Not Found",
      robots: { index: false, follow: false },
    };
  }

  const guide = getAreaGuide(slug);
  if (guide) {
    return buildPageMetadata({
      title: guide.metadataTitle,
      description: area.metaDescription,
      path: `/areas/${slug}`,
    });
  }
  const canonical = absoluteUrl(`/areas/${slug}`);

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

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();
  const guide = getAreaGuide(slug);

  const nearbyAreaData = area.nearbyAreas
    .map((slug) => AREAS.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        id={`area-breadcrumb-${slug}`}
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Areas", url: "/areas" },
            { name: area.name, url: `/areas/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(`/areas/${slug}`)}#service`,
            name: `${area.name} man and van and removals`,
            description: area.metaDescription,
            url: absoluteUrl(`/areas/${slug}`),
            provider: {
              "@type": "MovingCompany",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_LEGAL_NAME,
              url: SITE_URL,
            },
            areaServed: {
              "@type": area.schemaType ?? (guide ? "City" : "AdministrativeArea"),
              name: area.name,
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
            <ol className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/areas" className="hover:text-white transition-colors">
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
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
              {area.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
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
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-center text-base font-black text-black motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
              >
                {guide ? "Get a Moving Quote" : "Start an Online Quote"}
              </Link>
              <a
                href="tel:07909032889"
                aria-label="Call us on 07909 032889"
                className="transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
              >
                <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
              </a>
              {guide && (
                <Link
                  href={`/pricing#${area.slug}`}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-center font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Man and van pricing guide
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {guide ? <AreaGuideContent area={area} guide={guide} /> : <>
      {/* Services in this area */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="area-services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="area-services-heading" className="text-2xl font-black text-white mb-8">
            Choose Your Moving Service
          </h2>
          <p className="mb-6 max-w-3xl leading-relaxed text-white/70">
            Compare the options for your {area.name} move. Share the collection
            and delivery postcodes to confirm the route, available date and any
            additional help. Specialist items and unusual access need assessment before booking.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
            {SERVICES.filter((service) => service.indexable !== false).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-amber-900/20 transition-all hover:border-amber-400/40"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {service.name}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                      From {getServicePriceLabel(service)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Local move planning */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
        aria-labelledby="why-us-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="why-us-heading" className="text-2xl font-black text-white mb-6">
              Planning a Move in {area.name}
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
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                      {point.body}
                    </p>
                    {point.source && (
                      <a href={point.source.href} className="mt-3 inline-block text-sm font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300">
                        {point.source.label}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.70)" }}>
                  Moving in {area.name} works best when access is clear before
                  the van arrives. Tell us about stairs, lifts, parking limits,
                  loading bays, narrow streets, and any timed handover so we can
                  recommend the right vehicle, crew size, and time allowance.
                </p>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.70)" }}>
                  Whether you&apos;re moving a single piece of furniture or
                  relocating a full home or business, our {area.name} quote is
                  based on the real job details: volume, access, mileage, crew
                  time, parking, and any packing or dismantling support you need.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                  You can start online for straightforward moves, or call the
                  team if the job has unusual access, heavy items, a long route,
                  or several collection and delivery points.
                </p>
              </div>
            )}

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
              {[
                "Inventory and handling requirements discussed",
                "Clear quote before booking",
                "Access and parking details checked",
                "Preferred date checked against availability",
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

      <section className="bg-[#0A0A0A] py-16" aria-labelledby="area-quote-heading">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="area-quote-heading" className="text-2xl font-black text-white">
            How Your {area.name} Moving Quote Works
          </h2>
          <p className="mt-4 leading-relaxed text-white/70">
            Start with both addresses, the items being moved and your preferred date.
            The price depends on the load, route distance in miles, crew, access and
            any agreed packing or dismantling. A short journey can still require
            extra handling when there are stairs or a long carry from the van.
          </p>
          <p className="mt-4 leading-relaxed text-white/70">
            We accept moves within Scotland and from {area.name} to destinations
            across Britain, including England and Wales. Check the quoted scope
            and charging basis before confirming. Minimum
            time, extra stops, waiting and parking arrangements should be discussed
            for your move. If the details change, contact the team to review the plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/pricing" className="font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300">
              Moving price guide
            </Link>
            <Link href="/services/long-distance-removals" className="font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300">
              Removals from Scotland across Britain
            </Link>
            <Link href="/services" className="font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300">
              Compare moving services
            </Link>
          </div>
        </div>
      </section>

      {area.faqs?.length ? (
        <section className="bg-amber-400/[0.04] py-16" aria-labelledby="area-faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 id="area-faq-heading" className="mb-8 text-2xl font-black text-white">
              {area.name} Moving Questions
            </h2>
            <div className="space-y-3">
              {area.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-amber-900/20 bg-white/[0.04]">
                  <summary className="cursor-pointer rounded-xl px-5 py-4 font-bold text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]">
                    {faq.question}
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed text-white/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      </>}

      <AreaExpansionLinks area={area} />

      {/* Nearby areas */}
      {nearbyAreaData.length > 0 && (
        <section
          className="py-16"
          style={{ background: "#0A0A0A" }}
          aria-labelledby="nearby-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="nearby-heading" className="text-2xl font-black text-white mb-6">
              Other Areas to Explore
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
            Get a Quote for Your {area.name} Move
          </h2>
          <p className="mt-3 text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.70)" }}>
            Share your items, route and preferred date to check your options.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-black text-black transition-transform motion-safe:hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Start Online Quote
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              className="transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
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
