import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICES, getBookableService, getServicePriceLabel } from "@/lib/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Moving Prices in Scotland",
  description:
    "Compare moving guide prices, hourly and fixed quotes in Scotland. Plan Glasgow, Aberdeen and Inverness moves around your items, access, route and agreed scope.",
  path: "/pricing",
});

const PRICE_FACTORS = [
  "Pickup and drop-off postcodes",
  "Volume, weight and number of items",
  "Stairs, lifts, parking and loading distance",
  "Crew size and van size",
  "Packing, dismantling or assembly support",
  "Timing, same-day requests and long-distance routes",
];

const TEXT_LINK_CLASS_NAME =
  "rounded-sm font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

const PRICING_FAQS = [
  {
    question: "Is the starting price the total or minimum charge for my move?",
    answer:
      "No. A published starting price is a guide to the service, not a confirmed total for your inventory and journey. Ask whether a minimum charge or minimum booking period applies, what the quote includes and how any additional time would be charged before accepting it.",
  },
  {
    question: "Can I work out the cost from the number of bedrooms?",
    answer:
      "Bedroom count helps describe a property, but it does not tell us how much furniture, boxes, loft storage or garden equipment you are taking. Include those items and the access at both addresses so the quote reflects the actual load.",
  },
  {
    question: "Are packing, dismantling and assembly included?",
    answer:
      "Do not assume these tasks are included in a transport price. List the help you need, including packing materials and the furniture that needs dismantling or reassembly, and check which tasks are expressly included in your quote. Specialist handling and any disposal need separate confirmation.",
  },
  {
    question: "What if my item list, date or destination changes?",
    answer:
      "Tell us before the move and ask for the quote and availability to be checked again. A different load, route, access arrangement or date can change the work required. Confirm the revised scope and price before relying on the original quote.",
  },
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
            Use these starting prices to compare services, then request a quote
            for your route, load, access, crew requirements and date. Confirm the
            total and the work included before you book.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-black text-center text-black motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Request a Moving Quote
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              className="self-start motion-safe:transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
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
              A &ldquo;from&rdquo; price is an advertised starting point, not a
              guaranteed total or a statement of the minimum charge for your
              move. Where shown, /hr means per hour. Prices are shown in GBP.
            </p>
          </div>

          <div
            className="mt-10 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <table className="w-full text-left">
              <caption className="sr-only">
                Service starting prices and suitable moves. Request a quote for
                the complete cost of your move.
              </caption>
              <thead
                className="text-xs uppercase tracking-wider"
                style={{ background: "rgba(245,158,11,0.08)", color: "rgba(255,255,255,0.55)" }}
              >
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6">Service</th>
                  <th scope="col" className="hidden px-4 py-3 sm:table-cell sm:px-6">Best For</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 text-right">From</th>
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
                      <th scope="row" className="px-4 py-4 sm:px-6 align-top font-normal">
                        <Link
                          href={`/services/${service.slug}`}
                          className="rounded-sm font-semibold text-white hover:text-amber-400 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          {service.name}
                        </Link>
                        {service.bookable === false && (
                          <p className="mt-1 text-xs text-white/60">
                            Booked through {bookableService.name}.
                          </p>
                        )}
                        <p className="mt-2 text-sm leading-relaxed text-white/60 sm:hidden">
                          {service.description}
                        </p>
                      </th>
                      <td className="hidden px-4 py-4 sm:table-cell sm:px-6 align-top text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {service.description}
                      </td>
                      <td className="px-4 py-4 sm:px-6 align-top text-right font-bold text-amber-400 whitespace-nowrap">
                        {getServicePriceLabel(service)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16" aria-labelledby="quote-types-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="quote-types-heading" className="text-3xl font-black text-white">
            Hourly or fixed price: compare the whole job
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/60">
            The right comparison uses the same inventory, addresses, date and
            lifting support. A lower hourly rate does not establish a lower total
            if the time or included work differs.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="min-w-0 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-xl font-bold text-white">An hourly quote</h3>
              <p className="mt-3 leading-relaxed text-white/60">
                Hourly options can suit a manageable load where the time needed
                is understood. Before accepting, ask when chargeable time starts
                and ends, whether travel and loading are included, and whether a
                minimum booking period or charge applies.
              </p>
              <p className="mt-3 leading-relaxed text-white/60">
                Confirm how additional time is charged and how waiting for keys
                or access would be handled. The published hourly starting rate
                alone cannot answer those questions.
              </p>
              <Link href="/services/man-and-van" className={`mt-4 inline-block ${TEXT_LINK_CLASS_NAME}`}>
                Explore man and van moves
              </Link>
            </article>
            <article className="min-w-0 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-xl font-bold text-white">A fixed quote</h3>
              <p className="mt-3 leading-relaxed text-white/60">
                A fixed quote sets a price for an agreed scope. It can help when
                planning a full home, an office relocation or a longer route,
                provided the item list and access details are complete.
              </p>
              <p className="mt-3 leading-relaxed text-white/60">
                Check the collection and delivery arrangements, crew, stops and
                any extra tasks. Ask how a changed inventory, waiting time or
                an extra stop would affect the agreement; a fixed quote should
                not be treated as permission to add unlimited work.
              </p>
              <Link href="/services/house-removal" className={`mt-4 inline-block ${TEXT_LINK_CLASS_NAME}`}>
                Plan a house removal
              </Link>
            </article>
          </div>
          <p className="mt-6 leading-relaxed text-white/60">
            Unsure which service fits? Read our guide to{" "}
            <Link href="/guides/man-and-van-or-house-removals" className={TEXT_LINK_CLASS_NAME}>
              choosing man and van or house removals
            </Link>
            .
          </p>
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
              className="mt-5 block rounded-lg px-5 py-3 text-center font-black text-black motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Start Quote
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16" aria-labelledby="city-quote-planning-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="city-quote-planning-heading" className="text-3xl font-black text-white">
            Planning a quote in Edinburgh, Glasgow, Aberdeen or Inverness
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/60">
            These are planning examples, not records of completed jobs or priced
            offers. Use the details that apply to your addresses when requesting
            a quote.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article id="edinburgh" className="min-w-0 scroll-mt-24 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold text-white">Edinburgh: plan around room handover and stairs</h3>
              <p className="mt-4 leading-relaxed text-white/60">
                For a student or shared-flat move, list your own boxes, bags and
                furniture, then give both floors, the stair or lift arrangement
                and the walk from the loading point. Confirm when you must leave
                the old room and when you can enter the new one.
              </p>
              <p className="mt-4 leading-relaxed text-white/60">
                If the dates leave a gap, arrange storage separately and include
                its address, access hours and any later collection in the
                transport enquiry. Ask what lifting help, waiting, parking and
                additional stops are included in the total. A short journey
                between flats does not establish the handling time or price.
              </p>
              <ul className="mt-5 space-y-3" role="list">
                <li><Link href="/areas/edinburgh" className={TEXT_LINK_CLASS_NAME}>Edinburgh moving and access guide</Link></li>
                <li><Link href="/areas/edinburgh/student-move" className={TEXT_LINK_CLASS_NAME}>Edinburgh student removals and storage transfers</Link></li>
                <li><Link href="/areas/edinburgh/flat-removals" className={TEXT_LINK_CLASS_NAME}>Edinburgh flat removal planning</Link></li>
              </ul>
            </article>
            <article id="glasgow" className="min-w-0 scroll-mt-24 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold text-white">Glasgow: account for tenement access and loading</h3>
              <p className="mt-4 leading-relaxed text-white/60">
                For a tenement flat move, describe the stair flights, tightest
                landing, largest furniture and walk from the close to a lawful
                loading point. A short journey across Glasgow can still need
                substantial loading and unloading time.
              </p>
              <p className="mt-4 leading-relaxed text-white/60">
                Include any dismantling, additional lifting help, storage stop
                or key handover window. Check the total for that scope and any
                minimum charge. These details describe the work to be quoted;
                they do not imply a standard Glasgow stair or parking fee.
              </p>
              <ul className="mt-5 space-y-3" role="list">
                <li><Link href="/areas/glasgow" className={TEXT_LINK_CLASS_NAME}>Glasgow moving and access guide</Link></li>
                <li><Link href="/areas/glasgow/flat-removals" className={TEXT_LINK_CLASS_NAME}>Glasgow flat and tenement removals</Link></li>
                <li><Link href="/areas/glasgow/furniture-delivery" className={TEXT_LINK_CLASS_NAME}>Glasgow furniture collection and delivery</Link></li>
              </ul>
            </article>
            <article id="aberdeen" className="min-w-0 scroll-mt-24 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold text-white">Aberdeen: allow for the route from flat to van</h3>
              <p className="mt-4 leading-relaxed text-white/60">
                For example, a sofa collection from an upper-floor flat could
                involve more handling than the same item at ground level. Note
                the floor, lift dimensions, stair turns, door widths and the
                distance from the entrance to a lawful loading point at both
                addresses.
              </p>
              <p className="mt-4 leading-relaxed text-white/60">
                If a building or business controls its loading bay, include the
                access slot and any booking requirement. Check parking signs and
                building arrangements before choosing a collection time. These
                details help establish the lifting support and time required;
                they do not imply a standard city surcharge.
              </p>
              <ul className="mt-5 space-y-3" role="list">
                <li><Link href="/areas/aberdeen" className={TEXT_LINK_CLASS_NAME}>Aberdeen moving and access guide</Link></li>
                <li><Link href="/areas/aberdeen/flat-removals" className={TEXT_LINK_CLASS_NAME}>Aberdeen flat and apartment removals</Link></li>
                <li><Link href="/areas/aberdeen/furniture-delivery" className={TEXT_LINK_CLASS_NAME}>Aberdeen furniture collection and delivery</Link></li>
              </ul>
            </article>
            <article id="inverness" className="min-w-0 scroll-mt-24 rounded-xl border border-amber-400/15 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold text-white">Inverness: describe the complete onward journey</h3>
              <p className="mt-4 leading-relaxed text-white/60">
                For example, a move from Inverness to a rural Highland address
                needs more detail than the destination town. Provide both
                postcodes, every stop and any known narrow approach, steep
                driveway, gate, height restriction or limited turning space.
                Explain where loading and unloading can take place.
              </p>
              <p className="mt-4 leading-relaxed text-white/60">
                Include the full inventory, any key handover window and the
                requested delivery date. Ask for the route in miles, vehicle
                suitability, handling time and availability to be confirmed
                together. Distance alone does not establish a total price or
                guarantee that a particular vehicle can reach the property.
              </p>
              <ul className="mt-5 space-y-3" role="list">
                <li><Link href="/areas/inverness" className={TEXT_LINK_CLASS_NAME}>Inverness moving and access guide</Link></li>
                <li><Link href="/areas/inverness/house-removal" className={TEXT_LINK_CLASS_NAME}>Inverness house removal planning</Link></li>
                <li><Link href="/services/long-distance-removals" className={TEXT_LINK_CLASS_NAME}>Long-distance removal planning</Link></li>
                <li><Link href="/services/small-moves" className={TEXT_LINK_CLASS_NAME}>Small loads and partial moves</Link></li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-amber-400/[0.04] py-16" aria-labelledby="pricing-questions-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="pricing-questions-heading" className="text-3xl font-black text-white">
            Moving price questions
          </h2>
          <div className="mt-8 space-y-4">
            {PRICING_FAQS.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-amber-400/15 bg-white/[0.04]">
                <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-xl p-5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
                  <span>{faq.question}</span>
                  <svg className="chevron h-5 w-5 shrink-0 text-white/70 motion-safe:transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 leading-relaxed text-white/60">
            Have your item list, both addresses and preferred date ready. A quote
            request does not reserve a date; confirm the scope, price and booking
            arrangements before making plans around the move.
          </p>
          <Link href="/book" className="btn-primary mt-6 text-center motion-reduce:transition-none">
            Request a quote for your move
          </Link>
        </div>
      </section>
    </>
  );
}
