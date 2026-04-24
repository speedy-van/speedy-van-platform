import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { AREAS } from "@/lib/areas";

export const metadata: Metadata = {
  title: "SpeedyVan | Man and Van, Removals & Delivery Across Scotland",
  description:
    "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, and beyond. Fixed prices, fully insured, book online in minutes.",
  keywords: [
    "man and van Scotland",
    "removals Glasgow",
    "removals Edinburgh",
    "removals Dundee",
    "removals Aberdeen",
    "removal company Scotland",
    "man with van Glasgow",
    "man with van Edinburgh",
    "house removal Scotland",
    "office removals Scotland",
    "furniture delivery Scotland",
    "van hire Scotland",
  ],
  openGraph: {
    title: "SpeedyVan | Man and Van & Removals Across Scotland",
    description:
      "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, and beyond. Fixed prices, fully insured.",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: "4.9/5", label: "Customer rating", icon: "⭐" },
  { value: "1,000+", label: "Successful moves", icon: "🚐" },
  { value: "30+", label: "Scottish towns covered", icon: "📍" },
  { value: "100%", label: "Fully insured", icon: "🛡️" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Get an instant quote",
    description:
      "Tell us what you need to move, where, and when. Our transparent pricing means you know the cost upfront — no haggling, no hidden fees.",
  },
  {
    step: "2",
    title: "Book your van",
    description:
      "Choose your preferred date and time. We're available 7 days a week, including evenings and bank holidays. Same-day bookings welcome.",
  },
  {
    step: "3",
    title: "We arrive and move",
    description:
      "Your professional, insured driver arrives on time with the right van. They handle the heavy lifting while you focus on your new start.",
  },
];

const PRICING_TIERS = [
  {
    size: "Small Van",
    icon: "🚗",
    capacity: "1–2 rooms",
    price: 45,
    features: ["Up to 200 cubic ft", "1 person included", "Ideal for student moves", "Perfect for single items"],
    popular: false,
  },
  {
    size: "Medium Van",
    icon: "🚐",
    capacity: "2–3 rooms",
    price: 55,
    features: ["Up to 350 cubic ft", "2 people included", "Great for flat moves", "Most popular choice"],
    popular: true,
  },
  {
    size: "Large Van",
    icon: "🚚",
    capacity: "3–4 rooms",
    price: 65,
    features: ["Up to 500 cubic ft", "2–3 people included", "House removals", "Office relocations"],
    popular: false,
  },
  {
    size: "Luton Van",
    icon: "🚛",
    capacity: "4–5 rooms",
    price: 75,
    features: ["Up to 700 cubic ft", "3 people included", "Full house moves", "Large office clears"],
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah T.",
    location: "Glasgow West End",
    rating: 5,
    text: "Absolutely brilliant service! The driver arrived 10 minutes early, was dead careful with all my belongings, and even helped reassemble my bed frame. Will definitely use SpeedyVan again — moving in Glasgow has never been this easy.",
    service: "House Removal",
  },
  {
    name: "James R.",
    location: "Edinburgh New Town",
    rating: 5,
    text: "Used SpeedyVan for an office relocation over the weekend. Everything went smoothly — out on Saturday evening, back at desks Monday morning. Highly recommend for business moves in Edinburgh.",
    service: "Office Removal",
  },
  {
    name: "Caitlin M.",
    location: "Dundee Waterfront",
    rating: 5,
    text: "Booked same-day for an IKEA collection and assembly. The team built my entire bedroom in two hours. Incredible value — no flat-pack stress. Five stars from Dundee!",
    service: "IKEA Delivery & Assembly",
  },
  {
    name: "Tom W.",
    location: "Hamilton, Lanarkshire",
    rating: 5,
    text: "Moved from Hamilton to Aberdeen — a long way, but SpeedyVan handled it perfectly. Everything arrived in exactly the same condition as it left. Great communication throughout the whole journey.",
    service: "House Removal",
  },
];

const FAQS = [
  {
    question: "How do I get a quote?",
    answer:
      "Click 'Book Now' above and fill in your move details. You'll receive an instant price online. For complex or larger moves, call us on 01202 129746 and we'll prepare a detailed quote within the hour.",
  },
  {
    question: "How far in advance do I need to book?",
    answer:
      "For weekday moves, 24–48 hours' notice is usually sufficient. For weekend moves — especially at month ends — we recommend booking 2–4 weeks ahead. Same-day bookings are accepted subject to availability.",
  },
  {
    question: "Are my belongings insured during the move?",
    answer:
      "Yes. All SpeedyVan moves are covered by goods-in-transit insurance up to £10,000 as standard. Enhanced cover up to £50,000 is available for an additional fee.",
  },
  {
    question: "What areas of Scotland do you cover?",
    answer:
      "We cover over 30 locations across Scotland including Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness, Hamilton, East Kilbride, Paisley, Ayr, Falkirk, and the Scottish Borders. View our full areas list to find your nearest coverage zone.",
  },
  {
    question: "Do you offer fixed prices or hourly rates?",
    answer:
      "Both. Man and van bookings are typically hourly. Full house and office removals can be quoted at a fixed price after a brief survey. We'll recommend the best option for your move.",
  },
  {
    question: "Do you move between Scottish cities?",
    answer:
      "Absolutely. We handle long-distance moves across Scotland every day — Glasgow to Edinburgh, Aberdeen to Inverness, Dundee to Stirling, and anywhere in between. Fixed-price quotes available for all intercity routes.",
  },
  {
    question: "What if my move takes longer than expected?",
    answer:
      "For hourly bookings, you simply pay for the additional time at the same hourly rate. For fixed-price moves, reasonable delays are included. We'll always communicate clearly if extra time is needed.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #FACC15 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F97316 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/30 rounded-full px-4 py-1.5 text-primary-300 text-sm font-medium mb-6">
              <span aria-hidden="true">🚐</span>
              <span>GLASGOW · EDINBURGH · DUNDEE</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            >
              Your Move.{" "}
              <span className="text-primary-400">Sorted.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              House moves, office relocations, single items, pianos — if it fits
              through a door, we&apos;ll get it there. Fixed prices. Fully insured.
              Book in under 2 minutes.
            </p>

            <div id="get-quote" className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="btn-primary text-base px-8 py-4 text-center"
              >
                Book Now
              </Link>
              <Link
                href="/#services"
                className="btn-secondary text-base px-8 py-4 border-white text-white hover:bg-white hover:text-slate-900 text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section className="bg-primary-400" aria-label="Trust statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ul
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            role="list"
          >
            {TRUST_STATS.map((stat) => (
              <li
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <span className="text-2xl mb-1" aria-hidden="true">
                  {stat.icon}
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section
        id="services"
        className="py-20 bg-white"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="services-heading" className="section-heading">
              Everything You Need to Move
            </h2>
            <p className="section-subheading mx-auto">
              From a single item to an entire office, we have a service that fits.
              All bookings include a professional driver and goods-in-transit insurance.
            </p>
          </div>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
          >
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full rounded-2xl border border-slate-200 p-6 hover:border-primary-400 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-4xl mb-4 block" aria-hidden="true">
                    {service.icon}
                  </span>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-primary-600">
                    From £{service.startingFrom} →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 bg-slate-50"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-it-works-heading" className="section-heading">
              Moving Made Simple
            </h2>
            <p className="section-subheading mx-auto">
              Three easy steps stand between you and your new place.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line on desktop */}
            <div
              className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-primary-200"
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map((step) => (
              <li key={step.step} className="flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-primary-400 text-slate-900 text-3xl font-extrabold mb-6 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link href="/book" className="btn-primary text-base px-8 py-4">
              Book Your Move Today
            </Link>
          </div>
        </div>
      </section>

      {/* ── Areas ─────────────────────────────────────────────────────────── */}
      <section
        id="areas"
        className="py-20 bg-white"
        aria-labelledby="areas-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="areas-heading" className="section-heading">
              Covering All of Scotland
            </h2>
            <p className="section-subheading mx-auto">
              From Glasgow to the Highlands — click your area for local pricing and details.
            </p>
          </div>

          {([
            "Greater Glasgow",
            "Edinburgh & Lothians",
            "Tayside & Fife",
            "Grampian",
            "Highlands",
            "Central Scotland",
            "West Scotland",
            "Borders & South West",
          ] as const).map((region) => {
            const regionAreas = AREAS.filter((a) => a.region === region);
            if (regionAreas.length === 0) return null;
            return (
              <div key={region} className="mb-8">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span aria-hidden="true">📍</span> {region}
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" role="list">
                  {regionAreas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={`/areas/${area.slug}`}
                        className="block text-center py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-400 hover:bg-primary-50 hover:text-slate-900 transition-all"
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 bg-slate-900 text-white"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              No hidden fees, no surprise charges. The price we quote is
              the price you pay — guaranteed.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {PRICING_TIERS.map((tier) => (
              <li
                key={tier.size}
                className={`relative rounded-2xl p-6 ${
                  tier.popular
                    ? "bg-primary-400 text-slate-900 ring-4 ring-primary-300"
                    : "bg-slate-800 text-white"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-slate-900 text-primary-400 text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-3xl mb-3" aria-hidden="true">
                  {tier.icon}
                </div>
                <h3 className="font-bold text-xl">{tier.size}</h3>
                <p className={`text-sm mt-1 ${tier.popular ? "text-slate-700" : "text-slate-400"}`}>
                  {tier.capacity}
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold">£{tier.price}</span>
                  <span className={`text-sm ${tier.popular ? "text-slate-700" : "text-slate-400"}`}>
                    /hr
                  </span>
                </div>
                <ul className="space-y-2" role="list">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-sm ${
                        tier.popular ? "text-slate-800" : "text-slate-300"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 shrink-0 ${tier.popular ? "text-slate-700" : "text-primary-400"}`}
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
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className={`mt-6 block w-full text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    tier.popular
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-primary-400 text-slate-900 hover:bg-primary-500"
                  }`}
                >
                  Book {tier.size}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-slate-500">
            All prices are per hour. Minimum 2-hour booking. Fixed-price quotes available for house removals.
          </p>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section
        className="py-20 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="testimonials-heading" className="section-heading">
              Trusted by Thousands
            </h2>
            <p className="section-subheading mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what real SpeedyVan
              customers have to say.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
            {TESTIMONIALS.map((review) => (
              <li
                key={review.name}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
              >
                <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote>
                  <p className="text-slate-700 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </blockquote>
                <footer className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-800 font-medium px-2.5 py-1 rounded-full">
                    {review.service}
                  </span>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-20 bg-slate-50"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="section-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
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

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section
        className="py-20 bg-primary-400"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready for a Stress-Free Move?
          </h2>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
            Join over 1,000 satisfied customers. Get your free, no-obligation
            quote in minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+442012345678"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-8 py-4 font-bold text-white text-base hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              020 1234 5678
            </a>
            <a
              href="mailto:hello@speedyvan.co.uk"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 px-8 py-4 font-bold text-slate-900 text-base hover:bg-slate-900 hover:text-white transition-colors"
            >
              hello@speedyvan.co.uk
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
