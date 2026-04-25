import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import { AREAS } from "@/lib/areas";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/seo/schemas";
import { WhatsAppPhotoQuoteButton } from "@/components/WhatsAppPhotoQuoteButton";

const SITE_URL = "https://speedyvan.uk";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };

  const canonical = `${SITE_URL}/services/${params.slug}`;

  return {
    title: `${service.name} | SpeedyVan`,
    description: service.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${service.name} | SpeedyVan`,
      description: service.metaDescription,
      url: canonical,
      images: [
        {
          url: OG_IMAGE,
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
      images: [OG_IMAGE],
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  // Show a selection of areas (first 10) for cross-linking
  const featuredAreas = AREAS.slice(0, 10);
  const canonical = `${SITE_URL}/services/${params.slug}`;

  return (
    <>
      <JsonLd
        id={`service-jsonld-${params.slug}`}
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/#services" },
            { name: service.name, url: `/services/${params.slug}` },
          ]),
          buildServiceSchema(service.name, service.metaDescription, canonical),
        ]}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
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
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {service.name}
            </h1>
            <p className="mt-2 text-xl text-primary-300 font-medium">
              {service.tagline}
            </p>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              {service.longDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/book?service=${params.slug}`}
                className="btn-primary text-base px-8 py-4"
              >
                Book {service.name} Online
              </Link>
              <a
                href="tel:01202129746"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none"
              >
                📞 Call for quote
              </a>
              <p className="w-full sm:w-auto text-slate-400 text-sm">
                From{" "}
                <span className="text-white font-bold text-xl">
                  £{service.startingFrom}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-white" aria-labelledby="includes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 id="includes-heading" className="text-2xl font-bold text-slate-900 mb-6">
                What&apos;s Included
              </h2>
              <ul className="space-y-3" role="list">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
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
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Why SpeedyVan?
              </h2>
              <ul className="space-y-3" role="list">
                {service.whyUs.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold text-lg leading-none mt-0.5" aria-hidden="true">→</span>
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Pricing highlight */}
              <div className="mt-8 bg-primary-50 border border-primary-200 rounded-2xl p-6">
                <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-1">
                  Starting from
                </p>
                <p className="text-4xl font-extrabold text-slate-900">
                  £{service.startingFrom}
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Transparent pricing · No hidden fees
                </p>
                <Link
                  href={`/book?service=${params.slug}`}
                  className="mt-4 btn-primary w-full text-center block"
                >
                  Book Online Now
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

      {/* FAQ */}
      <section className="py-16 bg-slate-50" aria-labelledby="service-faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-faq-heading" className="text-2xl font-bold text-slate-900 mb-8">
            {service.name} — Common Questions
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq) => (
              <details
                key={faq.question}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors">
                  <span>{faq.question}</span>
                  <svg
                    className="chevron w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Available areas */}
      <section className="py-16 bg-white" aria-labelledby="service-areas-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-areas-heading" className="text-2xl font-bold text-slate-900 mb-6">
            {service.name} Available In
          </h2>
          <ul className="flex flex-wrap gap-3 mb-4" role="list">
            {featuredAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="inline-block px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-400 hover:bg-primary-50 transition-all"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#areas"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all Scottish areas →
          </Link>
        </div>
      </section>

      {/* Other services */}
      <section className="py-16 bg-slate-50" aria-labelledby="other-services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="other-services-heading" className="text-2xl font-bold text-slate-900 mb-6">
            Other Services
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" role="list">
            {SERVICES.filter((s) => s.slug !== service.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
                >
                  <span className="text-2xl mb-2" aria-hidden="true">{other.icon}</span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-primary-700">
                    {other.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Book Your {service.name} Today
          </h2>
          <p className="mt-3 text-slate-700 text-lg">
            Professional service · Instant quotes · 7 days a week
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/book?service=${params.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-8 py-4 font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Book {service.name} Online
            </Link>
            <a
              href="tel:01202129746"
              className="btn-secondary border-slate-900 text-slate-900 px-8 py-4"
            >
              📞 01202 129746
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
