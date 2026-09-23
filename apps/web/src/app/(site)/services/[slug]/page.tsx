import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SERVICES,
  getServiceBySlug,
  getServicePriceLabel,
  type ServiceFaq,
} from "@/lib/services";
import { FEATURED_AREAS } from "@/lib/areas";
import { SERVICE_BOOKING_STEPS, SERVICE_PLANNING } from "@/lib/content/service-planning";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/seo/schemas";
import { WhatsAppPhotoQuoteButton } from "@/components/WhatsAppPhotoQuoteButton";
import { SITE_OG_IMAGE, absoluteUrl } from "@/lib/seo/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

const SERVICE_DECISION_LINKS = [
  {
    slug: "man-and-van",
    label: "Man and Van",
    body: "best for smaller loads, single rooms, storage runs and flexible van-with-driver help.",
  },
  {
    slug: "house-removal",
    label: "House Removals",
    body: "better for full-home moves, larger crews, packing support and fixed-price planning.",
  },
  {
    slug: "furniture-delivery",
    label: "Furniture Delivery",
    body: "better for bulky items, private-seller collections, retailer pickups and room-of-choice delivery.",
  },
  {
    slug: "office-removal",
    label: "Office Removals",
    body: "better for business moves with equipment, access windows and downtime planning.",
  },
];

function renderFaqAnswer(faq: ServiceFaq) {
  if (!faq.links?.length) return faq.answer;

  const nodes: React.ReactNode[] = [faq.answer];

  faq.links.forEach((link) => {
    const nextNodes: React.ReactNode[] = [];

    nodes.forEach((node, nodeIndex) => {
      if (typeof node !== "string") {
        nextNodes.push(node);
        return;
      }

      const parts = node.split(link.label);
      parts.forEach((part, partIndex) => {
        if (part) nextNodes.push(part);
        if (partIndex < parts.length - 1) {
          nextNodes.push(
            <Link
              key={`${link.href}-${nodeIndex}-${partIndex}`}
              href={link.href}
              className="font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
            >
              {link.label}
            </Link>
          );
        }
      });
    });

    nodes.splice(0, nodes.length, ...nextNodes);
  });

  return nodes;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = absoluteUrl(`/services/${slug}`);

  return {
    title: `${service.name} in Scotland`,
    description: service.metaDescription,
    robots:
      service.indexable === false
        ? { index: false, follow: true }
        : { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${service.name} | SpeedyVan`,
      description: service.metaDescription,
      url: canonical,
      images: [
        {
          url: SITE_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${service.name} – SpeedyVan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | SpeedyVan`,
      description: service.metaDescription,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const priceLabel = getServicePriceLabel(service);
  const planning = SERVICE_PLANNING[service.slug];
  const featuredAreas = FEATURED_AREAS;
  const canonical = absoluteUrl(`/services/${slug}`);

  return (
    <>
      <JsonLd
        id={`service-jsonld-${slug}`}
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.name, url: `/services/${slug}` },
          ]),
          buildServiceSchema(
            service.name,
            service.metaDescription,
            canonical,
            service.startingFrom,
            service.priceUnit
          ),
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
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="text-5xl mb-4 block" aria-hidden="true">
              {service.icon}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
              {service.name}
            </h1>
            <p className="mt-2 text-xl text-amber-400 font-bold">
              {service.tagline}
            </p>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
              {service.longDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/book?service=${service.slug}`}
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-black text-black transition-transform motion-safe:hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
              >
                Get an Online Quote
              </Link>
              <a
                href="tel:07909032889"
                aria-label="Call us on 07909 032889"
                className="transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
              >
                <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
              </a>
              <p className="w-full sm:w-auto text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                From{" "}
                <span className="text-white font-black text-xl">
                  {priceLabel}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="includes-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 id="includes-heading" className="text-2xl font-black text-white mb-6">
                What&apos;s Included
              </h2>
              <ul className="space-y-3" role="list">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
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
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white mb-6">
                Why SpeedyVan?
              </h2>
              <ul className="space-y-3" role="list">
                {service.whyUs.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="text-amber-400 font-black text-lg leading-none mt-0.5" aria-hidden="true">→</span>
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Pricing highlight */}
              <div
                className="mt-8 rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <p className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Starting from
                </p>
                <p className="text-4xl font-black text-white">
                  {priceLabel}
                </p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>
                  Guide price · Your quote depends on the move
                </p>
                <Link
                  href={`/book?service=${service.slug}`}
                  className="mt-4 block rounded-lg px-5 py-3 text-center font-black text-black transition-transform motion-safe:hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
                >
                  Start an Online Quote
                </Link>
                <WhatsAppPhotoQuoteButton
                  serviceName={service.name}
                  className="mt-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Move planning */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
        aria-labelledby="service-planning-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="service-planning-heading" className="text-2xl font-black text-white">
              Plan Your Move
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
              {planning?.suitableFor ??
                "Share your item list, both addresses and the access at each property. The scope and availability need to be confirmed before booking."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {(planning?.preparation ?? [
              {
                title: "Access",
                body: "Tell us about stairs, lifts, narrow closes, loading bays, parking restrictions, long carries and any timed key handover.",
              },
              {
                title: "Items",
                body: "List bulky, heavy, fragile or awkward items. Photos and dimensions help assess the handling and crew required.",
              },
              {
                title: "Preparation",
                body: "Pack loose items, label boxes by room and flag anything that needs dismantling. Discuss unusual or specialist requirements before booking.",
              },
            ]).map((point) => (
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
              </article>
            ))}
          </div>

          {planning && (
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-black text-white">Vehicle and crew</h3>
                <p className="mt-3 leading-relaxed text-white/70">{planning.vehicleAndCrew}</p>
                <h3 className="mt-6 text-xl font-black text-white">How your quote is worked out</h3>
                <p className="mt-3 leading-relaxed text-white/70">{planning.pricing}</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">What is not included as standard</h3>
                <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-white/70">
                  {planning.notIncluded.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-black text-white">Choosing the right service</h3>
            <ul className="mt-4 grid gap-3 md:grid-cols-2" role="list">
              {SERVICE_DECISION_LINKS.filter((item) => item.slug !== service.slug).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group block rounded-lg border border-amber-900/20 p-4 transition-colors hover:border-amber-400/40"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span className="font-black text-white group-hover:text-amber-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                      {item.body}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/pricing"
                  className="group block rounded-lg border border-amber-900/20 p-4 transition-colors hover:border-amber-400/40"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="font-black text-white group-hover:text-amber-400 transition-colors">
                    Moving Prices
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                    compare guide prices and the main factors that change the confirmed quote.
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16" aria-labelledby="service-booking-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="service-booking-heading" className="text-2xl font-black text-white">
            How to arrange your move
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {SERVICE_BOOKING_STEPS.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-amber-900/20 bg-white/[0.04] p-5">
                <span className="text-sm font-bold text-amber-400">Step {index + 1}</span>
                <h3 className="mt-2 font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="service-faq-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-faq-heading" className="text-2xl font-black text-white mb-8">
            {service.name} — Common Questions
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-amber-900/20 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <summary
                  className="flex items-center justify-between px-6 py-5 font-bold text-white cursor-pointer transition-colors hover:bg-white/5"
                >
                  <span>{faq.question}</span>
                  <svg
                    className="chevron w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                  {renderFaqAnswer(faq)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Available areas */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
        aria-labelledby="service-areas-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-areas-heading" className="text-2xl font-black text-white mb-6">
            Plan a Move in Scotland
          </h2>
          <p className="mb-6 max-w-3xl leading-relaxed text-white/70">
            Check the collection and delivery details for your area. Availability,
            vehicle access and any specialist requirements are confirmed for your route and date.
          </p>
          <ul className="flex flex-wrap gap-3 mb-4" role="list">
            {featuredAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="inline-block px-4 py-2 rounded-lg border border-amber-900/20 text-sm font-medium transition-all hover:border-amber-400/40 hover:text-amber-400"
                  style={{ color: "rgba(255,255,255,0.70)" }}
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/areas"
            className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            View all Scottish areas →
          </Link>
        </div>
      </section>

      {/* Other services */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="other-services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="other-services-heading" className="text-2xl font-black text-white mb-6">
            Other Services
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" role="list">
            {SERVICES.filter(
              (s) => s.slug !== service.slug && s.indexable !== false
            ).map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-amber-900/20 transition-all hover:border-amber-400/40"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-2xl mb-2" aria-hidden="true">{other.icon}</span>
                  <span className="text-sm font-medium group-hover:text-amber-400 transition-colors" style={{ color: "rgba(255,255,255,0.70)" }}>
                    {other.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-black leading-tight text-balance text-white sm:text-3xl">
            Get a Quote for {service.name}
          </h2>
          <p className="mt-3 text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.70)" }}>
            Share your items, addresses and preferred date to check your options.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/book?service=${service.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-black text-black transition-transform motion-safe:hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Get an Online Quote
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              className="transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
