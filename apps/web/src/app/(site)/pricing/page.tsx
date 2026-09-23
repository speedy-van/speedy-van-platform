import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, getBookableService } from "@/lib/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { SITE_OG_IMAGE, absoluteUrl } from "@/lib/seo/constants";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export const metadata: Metadata = {
  title: "Moving Prices in Scotland",
  description:
    "Guide prices for man and van, house removals, flat moves, furniture delivery, office removals and long-distance moves across Scotland. Get a confirmed quote online.",
  alternates: { canonical: absoluteUrl("/pricing") },
  openGraph: {
    title: "Moving Prices in Scotland | SpeedyVan",
    description:
      "Guide prices for Scottish man and van, removals and delivery services, with confirmed quotes before booking.",
    url: absoluteUrl("/pricing"),
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SpeedyVan moving prices in Scotland",
      },
    ],
  },
};

const PRICE_FACTORS = [
  "Pickup and drop-off postcodes",
  "Volume, weight and number of items",
  "Stairs, lifts, parking and loading distance",
  "Crew size and van size",
  "Packing, dismantling or assembly support",
  "Timing, same-day requests and long-distance routes",
];

export default function PricingPage() {
  const pricedServices = SERVICES.filter((service) => service.indexable !== false);

  return (
    <>
      <JsonLd
        id="pricing-jsonld"
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ])}
      />
      {/* Hero */}
      <section
        className="text-white py-16 lg:py-24"
        style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
            Guide prices
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-tight text-white">
            Moving Prices in Scotland
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Use these starting prices to choose the right service. Your confirmed
            quote is based on the actual route, load, access, crew size and
            timing, and is shown before you book.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-black text-center text-black transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Get a Confirmed Quote
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
      </section>

      {/* Service Prices Table */}
      <section
        className="py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="service-prices-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="service-prices-heading" className="text-3xl font-black text-white">
              Service Starting Prices
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Starting prices are useful for comparing services, but complex
              jobs should be quoted before booking. Prices are shown in GBP.
            </p>
          </div>

          <div
            className="mt-10 overflow-x-auto rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <table className="min-w-[720px] w-full text-left">
              <thead
                className="text-xs uppercase tracking-wider"
                style={{ background: "rgba(245,158,11,0.08)", color: "rgba(255,255,255,0.55)" }}
              >
                <tr>
                  <th className="px-4 py-3 sm:px-6">Service</th>
                  <th className="px-4 py-3 sm:px-6">Best For</th>
                  <th className="px-4 py-3 sm:px-6 text-right">From</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "rgba(245,158,11,0.08)" }}>
                {pricedServices.map((service) => {
                  const bookableService = getBookableService(service);
                  return (
                    <tr
                      key={service.slug}
                      style={{ borderTop: "1px solid rgba(245,158,11,0.08)" }}
                    >
                      <td className="px-4 py-4 sm:px-6 align-top">
                        <Link
                          href={`/services/${service.slug}`}
                          className="font-semibold text-white hover:text-amber-400 transition-colors"
                        >
                          {service.name}
                        </Link>
                        {service.bookable === false && (
                          <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                            Booked through {bookableService.name}.
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6 align-top text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {service.description}
                      </td>
                      <td className="px-4 py-4 sm:px-6 align-top text-right font-bold text-amber-400">
                        {money.format(service.startingFrom)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Price Factors */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)" }}
        aria-labelledby="price-factors-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 id="price-factors-heading" className="text-3xl font-black text-white">
              What Changes the Final Quote?
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Two moves with the same mileage can cost different amounts if one
              has stairs, heavy items, long carrying distance, or extra packing.
              We ask for these details before confirming a price.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
              {PRICE_FACTORS.map((factor) => (
                <li
                  key={factor}
                  className="flex items-start gap-3 rounded-lg p-4 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  <span className="mt-0.5 text-amber-400 font-bold" aria-hidden="true">✓</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          <aside
            className="rounded-xl p-6 self-start"
            style={{
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <h3 className="text-xl font-black text-white">Need a fixed price?</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              For full-house, office, long-distance, or multi-stop moves, a fixed
              quote is usually clearer than guessing the hourly time.
            </p>
            <Link
              href="/book"
              className="mt-5 block rounded-lg px-5 py-3 text-center font-black text-black transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Start Quote
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
