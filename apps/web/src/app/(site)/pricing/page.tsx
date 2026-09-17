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
  title: "Moving Prices in Scotland | SpeedyVan",
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
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full border border-primary-400/30 bg-primary-400/10 px-3 py-1 text-sm font-semibold text-primary-300">
            Guide prices
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
            Moving Prices in Scotland
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-relaxed">
            Use these starting prices to choose the right service. Your confirmed
            quote is based on the actual route, load, access, crew size and
            timing, and is shown before you book.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book" className="btn-primary px-8 py-4 text-base text-center">
              Get a Confirmed Quote
            </Link>
            <a
              href="tel:07909032889"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 font-semibold text-white hover:bg-white/5"
            >
              Call 07909 032889
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-labelledby="service-prices-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="service-prices-heading" className="text-3xl font-extrabold text-slate-900">
              Service Starting Prices
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Starting prices are useful for comparing services, but complex
              jobs should be quoted before booking. Prices are shown in GBP.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[720px] w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Service</th>
                  <th className="px-4 py-3 sm:px-6">Best For</th>
                  <th className="px-4 py-3 sm:px-6 text-right">From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pricedServices.map((service) => {
                  const bookableService = getBookableService(service);
                  return (
                    <tr key={service.slug}>
                      <td className="px-4 py-4 sm:px-6 align-top">
                        <Link
                          href={`/services/${service.slug}`}
                          className="font-semibold text-slate-900 hover:text-primary-700"
                        >
                          {service.name}
                        </Link>
                        {service.bookable === false && (
                          <p className="mt-1 text-xs text-slate-500">
                            Booked through {bookableService.name}.
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6 align-top text-sm text-slate-600">
                        {service.description}
                      </td>
                      <td className="px-4 py-4 sm:px-6 align-top text-right font-bold text-slate-900">
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

      <section className="py-16 bg-slate-50" aria-labelledby="price-factors-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 id="price-factors-heading" className="text-3xl font-extrabold text-slate-900">
              What Changes the Final Quote?
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Two moves with the same mileage can cost different amounts if one
              has stairs, heavy items, long carrying distance, or extra packing.
              We ask for these details before confirming a price.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
              {PRICE_FACTORS.map((factor) => (
                <li key={factor} className="flex items-start gap-3 rounded-lg bg-white p-4 text-sm text-slate-700 shadow-sm">
                  <span className="mt-0.5 text-primary-500" aria-hidden="true">✓</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-xl border border-primary-200 bg-primary-50 p-6">
            <h3 className="text-xl font-bold text-slate-900">Need a fixed price?</h3>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              For full-house, office, long-distance, or multi-stop moves, a fixed
              quote is usually clearer than guessing the hourly time.
            </p>
            <Link href="/book" className="mt-5 block rounded-lg bg-slate-900 px-5 py-3 text-center font-bold text-white hover:bg-slate-800">
              Start Quote
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
