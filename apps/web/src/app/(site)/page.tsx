import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { ServiceImageCard } from "@/components/shared/ServiceImageCard";
import { getServiceImage } from "@/lib/service-images";
import { AREAS } from "@/lib/areas";
import { InstantQuoteCalculator } from "@/components/InstantQuoteCalculator";
import { PostcodeCheck } from "@/components/PostcodeCheck";
import { LiveAvailability } from "@/components/LiveAvailability";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { ServiceComparison } from "@/components/ServiceComparison";
import { FaqSearch } from "@/components/FaqSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalBusinessSchema, buildFaqSchema } from "@/lib/seo/schemas";
import TypingHeroHeading from "@/components/TypingHeroHeading";

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
    url: "https://speedyvan.uk",
    images: [
      {
        url: "https://speedyvan.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SpeedyVan – Man and Van & Removals Across Scotland",
      },
    ],
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: "4.9", label: "Customer rating", suffix: "★" },
  { value: "1,000+", label: "Successful moves" },
  { value: "27+", label: "Scottish towns covered" },
  { value: "100%", label: "Fully insured" },
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
      <JsonLd
        id="home-jsonld"
        data={[buildLocalBusinessSchema(), buildFaqSchema(FAQS)]}
      />
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

        {/* Moving road animation */}
        <div className="hero-road" aria-hidden="true">
          <div className="hero-road-lines" />
        </div>

        {/* Right-side real-footage video */}
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-media-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero-van.mp4" type="video/mp4" />
          </video>
          <div className="hero-media-overlay" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/30 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-primary-300 text-[11px] sm:text-sm font-medium mb-4 sm:mb-6">
              <span aria-hidden="true">🚐</span>
              <span>GLASGOW · EDINBURGH · DUNDEE · ABERDEEN · ACROSS SCOTLAND</span>
            </div>

            <TypingHeroHeading
              id="hero-heading"
              prefix="Man and Van Services "
              highlight="Across Scotland"
              className="hero-fade-up hero-fade-up-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            />

            <p className="hero-fade-up hero-fade-up-3 mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              House moves, office removals, single items, furniture delivery and
              same-day transport — from £45/hr. Fixed prices available. Fully insured.
            </p>

            {/* Urgency badge */}
            <div className="hero-fade-up hero-fade-up-4 mt-6 sm:mt-10 mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-emerald-300 urgency-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Available now · Same-day service
            </div>

            <div id="get-quote" className="hero-fade-up hero-fade-up-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              {/* Primary: Call now */}
              <div className="flex flex-col">
                <a
                  href="tel:01202129746"
                  data-track-event="call_click"
                  data-track-location="hero_primary"
                  className="cta-pulse inline-flex items-center justify-center gap-2 rounded-lg bg-primary-400 px-7 sm:px-9 py-4 sm:py-5 text-lg sm:text-xl font-extrabold text-slate-900 shadow-lg shadow-primary-400/20 transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now 01202 129746
                </a>
                <span className="mt-2 inline-flex items-center gap-2 self-center sm:self-start rounded-full bg-slate-900/60 ring-1 ring-primary-400/40 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <span className="inline-flex items-center rounded-md bg-primary-400 text-slate-900 px-2 py-0.5 text-[11px] font-extrabold">
                    From £45
                  </span>
                  <span className="text-slate-100">Instant quote on call</span>
                </span>
              </div>

              {/* Secondary: Online quote */}
              <div className="flex flex-col">
                <Link
                  href="/book"
                  data-track-event="quote_click"
                  data-track-location="hero_secondary"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-transparent px-5 sm:px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Get Instant Quote Online
                </Link>
                <span className="mt-1.5 text-[11px] text-slate-400 text-center sm:text-left">
                  Takes 30 seconds · No obligation
                </span>
              </div>
            </div>

            {/* Live availability microcopy */}
            <LiveAvailability />

            {/* Postcode availability checker */}
            <PostcodeCheck />

            <ul
              className="hero-fade-up hero-fade-up-5 mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-2.5"
              role="list"
              aria-label="Trust signals"
            >
              {[
                "⭐ 4.9/5 Rating",
                "1,000+ Moves",
                "Fully Insured",
                "30+ Scottish Towns",
              ].map((badge, i) => (
                <li
                  key={badge}
                  className={`trust-badge trust-badge-${i + 1} inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-200`}
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Curved transition into yellow stats */}
        <svg
          className="absolute bottom-0 left-0 w-full h-8 sm:h-12 text-primary-400"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,60 L0,30 C240,60 480,0 720,15 C960,30 1200,60 1440,20 L1440,60 Z"
          />
        </svg>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section className="bg-primary-400 relative z-10" aria-label="Trust statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ul
            className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-0"
            role="list"
          >
            {TRUST_STATS.map((stat, i) => (
              <li
                key={stat.label}
                className={`flex flex-col items-center text-center px-2 ${
                  i < TRUST_STATS.length - 1
                    ? "md:border-r md:border-slate-900/15"
                    : ""
                }`}
              >
                <span className="flex items-baseline justify-center gap-1 text-3xl md:text-4xl font-extrabold text-slate-900 leading-none tracking-tight tabular-nums">
                  {stat.value}
                  {stat.suffix && (
                    <span
                      aria-hidden="true"
                      className="text-2xl md:text-3xl text-slate-900 inline-block animate-spin [animation-duration:4s]"
                    >
                      {stat.suffix}
                    </span>
                  )}
                </span>
                <span className="mt-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-800/80">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Instant quote calculator ──────────────────────────────────────── */}
      <InstantQuoteCalculator />

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
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
          >
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <ServiceImageCard
                  slug={service.slug}
                  title={service.name}
                  description={service.description}
                  price={`From £${service.startingFrom}`}
                  imagePath={getServiceImage(service.slug)}
                  href={`/services/${service.slug}`}
                  variant="homepage"
                />
              </li>
            ))}
            <li>
              {/* European Removals — custom image card with "New" badge */}
              <div className="relative">
                <span className="absolute -top-2 right-4 z-20 inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                  New
                </span>
                <ServiceImageCard
                  slug="european-removals"
                  title="European Removals"
                  description="Moving abroad? Door-to-door removals to 20+ European countries — fully insured, customs handled."
                  price="Get a free quote"
                  imagePath="/images/services/house-removal.jpg"
                  href="/services/european-removals"
                  variant="homepage"
                />
              </div>
            </li>
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

            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.step} className={`reveal step-card step-card-${i + 1} flex flex-col items-center text-center`}>
                <div className="step-badge relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-primary-400 text-slate-900 text-3xl font-extrabold mb-6 shadow-md">
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
            <Link
              href="/book"
              data-track-event="quote_click"
              data-track-location="how_it_works_cta"
              className="btn-primary text-base px-8 py-4"
            >
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
                <ul className="reveal-stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" role="list">
                  {regionAreas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={`/areas/${area.slug}`}
                        data-track-event="area_card_click"
                        data-track-location={`areas_${area.slug}`}
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

          <ul className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {PRICING_TIERS.map((tier) => (
              <li
                key={tier.size}
                className={`tier-lift relative rounded-2xl p-6 ${
                  tier.popular
                    ? "popular-glow bg-primary-400 text-slate-900 ring-4 ring-primary-300"
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
                  data-track-event="quote_click"
                  data-track-location={`pricing_tier_${tier.size.toLowerCase().replace(/\s+/g, "_")}`}
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

      {/* ── Service comparison ─────────────────────────────────────────── */}
      <ServiceComparison />

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

          <TestimonialsCarousel items={TESTIMONIALS} />

          {/* Verified-reviews credibility row */}
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-xs font-medium text-slate-600">
                Verified reviews on
              </span>
              <a
                href="https://g.page/speedyvan/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                aria-label="Read SpeedyVan reviews on Google"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Google Reviews
                <svg
                  className="w-3.5 h-3.5 opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
            <p className="text-sm text-slate-600">
              Had a great experience?{" "}
              <a
                href="https://g.page/speedyvan/review"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline"
              >
                Leave us a review →
              </a>
            </p>
          </div>
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

          <FaqSearch faqs={FAQS} />
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
              href="tel:01202129746"
              data-track-event="call_click"
              data-track-location="footer_cta"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-8 py-4 font-bold text-white text-base hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              01202 129746
            </a>
            <a
              href="mailto:hello@speedyvan.co.uk"
              data-track-event="email_click"
              data-track-location="footer_cta"
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
