import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, getAreaBySlug } from "@/lib/areas";
import { SERVICES } from "@/lib/services";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getAreaBySlug(params.slug);
  if (!area) return { title: "Area Not Found" };

  return {
    title: `${area.headline} | SpeedyVan`,
    description: area.metaDescription,
    openGraph: {
      title: `${area.headline} | SpeedyVan`,
      description: area.metaDescription,
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
            <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/30 rounded-full px-3 py-1 text-primary-300 text-sm font-medium mb-4">
              <span aria-hidden="true">📍</span>
              <span>{area.region}</span>
              {area.postcode && (
                <span className="text-primary-400/70">· {area.postcode}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {area.headline}
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              {area.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {area.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-full border border-slate-700"
                >
                  <svg
                    className="w-3.5 h-3.5 text-primary-400"
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
            <div className="mt-8">
              <a href="tel:+442012345678" className="btn-primary text-base px-8 py-4">
                Get a Quote for {area.name}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services in this area */}
      <section className="py-16 bg-white" aria-labelledby="area-services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="area-services-heading" className="text-2xl font-bold text-slate-900 mb-8">
            Services Available in {area.name}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" role="list">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
                >
                  <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 group-hover:text-primary-700 truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-slate-500">From £{service.startingFrom}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why SpeedyVan in this area */}
      <section className="py-16 bg-slate-50" aria-labelledby="why-us-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="why-us-heading" className="text-2xl font-bold text-slate-900 mb-6">
              Why Choose SpeedyVan in {area.name}?
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                SpeedyVan has been operating in {area.name} since 2018, building
                a reputation for punctuality, care, and fair pricing. Our{" "}
                local drivers
                know every access restriction, parking rule, and loading bay in{" "}
                {area.name}.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Whether you&apos;re moving a single piece of furniture or
                relocating your entire business, our {area.name} team brings the
                same commitment to every job: professional equipment, insured
                vehicles, and a friendly, hard-working crew.
              </p>
              <p className="text-slate-600 leading-relaxed">
                All SpeedyVan drivers in {area.name} are DBS-checked,
                fully-insured, and trained in safe manual handling. Our vans are
                maintained to the highest standard with regular safety checks.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
              {[
                "DBS-checked, vetted drivers",
                "Goods-in-transit insurance included",
                "No hidden fees or surcharges",
                "7-day availability, including bank holidays",
                "Same-day bookings when available",
                "5-star rated on Google Reviews",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-slate-700">
                  <svg
                    className="w-5 h-5 text-primary-500 shrink-0"
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
        <section className="py-16 bg-white" aria-labelledby="nearby-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="nearby-heading" className="text-2xl font-bold text-slate-900 mb-6">
              Also Covering Nearby Areas
            </h2>
            <ul className="flex flex-wrap gap-3" role="list">
              {nearbyAreaData.map((nearby) => (
                <li key={nearby.slug}>
                  <Link
                    href={`/areas/${nearby.slug}`}
                    className="inline-block px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-400 hover:bg-primary-50 transition-all"
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
      <section className="py-16 bg-primary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Book Your {area.name} Move Today
          </h2>
          <p className="mt-3 text-slate-700 text-lg">
            Instant quotes · Transparent pricing · Professional drivers
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+442012345678"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-8 py-4 font-bold text-white hover:bg-slate-800 transition-colors"
            >
              020 1234 5678
            </a>
            <a
              href="mailto:hello@speedyvan.co.uk"
              className="btn-secondary border-slate-900 text-slate-900 px-8 py-4"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
