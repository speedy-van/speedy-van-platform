import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SERVICES, getServicePriceLabel } from "@/lib/services";
import { ServiceImageCard } from "@/components/shared/ServiceImageCard";
import { getServiceImage } from "@/lib/service-images";
import { AREAS } from "@/lib/areas";
import { InstantQuoteCalculator } from "@/components/InstantQuoteCalculator";
import { PostcodeCheck } from "@/components/PostcodeCheck";
import { LiveAvailability } from "@/components/LiveAvailability";
import { ServiceComparison } from "@/components/ServiceComparison";
import { FaqSearch } from "@/components/FaqSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildLocalBusinessSchema,
  buildWebsiteSchema,
  buildFaqSchema,
  buildServiceCatalogSchema,
} from "@/lib/seo/schemas";
import TypingHeroHeading from "@/components/TypingHeroHeading";
import { SITE_OG_IMAGE, SITE_URL } from "@/lib/seo/constants";
import {
  BOOKING_SERVICE_OPTIONS,
} from "@/lib/booking-service-options";

export const metadata: Metadata = {
  title: {
    absolute: "SpeedyVan | Man and Van, Removals & Delivery Across Scotland",
  },
  description:
    "Book man and van services across Scotland: house removals from £120, furniture delivery from £60, storage runs from £45, office moves from £150 and flexible van help from £45.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "SpeedyVan | Man and Van & Removals Across Scotland",
    description:
      "House removals, furniture delivery, storage runs, office moves and flexible man-and-van help across Scotland with online quotes and booking.",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SpeedyVan – Man and Van & Removals Across Scotland",
      },
    ],
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: "Online", label: "Instant quote flow" },
  { value: "Scotland", label: "Service coverage" },
  { value: "Cover", label: "Goods in transit" },
  { value: "Dates", label: "Availability checked" },
];

const PHOTO_QUOTE_HREF =
  "https://wa.me/447909032889?text=" +
  encodeURIComponent("Hi SpeedyVan, I want to send photos for a moving quote.");

const CUSTOMER_PATHS = [
  {
    eyebrow: "Need it today",
    title: "Same-day move",
    body: "Call first so capacity, access and timing can be checked before you start.",
    href: "tel:07909032889",
    cta: "Call now",
  },
  {
    eyebrow: "Unsure on volume",
    title: "Send photos",
    body: "Share pictures of bulky items, stairs, doorways and parking for a cleaner quote.",
    href: PHOTO_QUOTE_HREF,
    cta: "Open WhatsApp",
    external: true,
  },
  {
    eyebrow: "Small job",
    title: "Single item",
    body: "Book furniture, appliances, sofas, beds and marketplace pickups online.",
    href: "/book?service=furniture",
    cta: "Price item",
  },
  {
    eyebrow: "Full place",
    title: "Home move",
    body: "Use the room-by-room inventory for houses, flats and student moves.",
    href: "/book?service=house-removals",
    cta: "Start home quote",
  },
  {
    eyebrow: "Business",
    title: "Office move",
    body: "Add access notes, downtime-sensitive timing and business inventory.",
    href: "/book?service=office",
    cta: "Plan office move",
  },
  {
    eyebrow: "Already booked",
    title: "Track booking",
    body: "Check live booking notes, status changes and driver progress.",
    href: "/track",
    cta: "Track move",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Get an instant quote",
    description:
      "Tell us what you need to move, both addresses, access details and your preferred date. The quote should reflect the full job before you pay.",
  },
  {
    step: "2",
    title: "Book your van",
    description:
      "Choose your preferred date and time. Crew and route availability must be checked; call first for same-day or unusual timing requirements.",
  },
  {
    step: "3",
    title: "We arrive and move",
    description:
      "Confirm loading access and keep your contact phone available. The agreed crew loads, transports and unloads the items included in your booking.",
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
    features: ["Up to 350 cubic ft", "2 people included", "Great for flat moves", "Useful for busy access"],
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

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const SEO_SERVICE_CATALOG_ITEMS = SERVICES.filter((service) => service.indexable !== false).map((service) => ({
  name: service.name,
  description: service.description,
  url: `/services/${service.slug}`,
  startingFrom: service.startingFrom,
  priceUnit: service.priceUnit,
  bookingUrl: `/book?service=${service.slug}`,
}));

const MOVE_DECISION_POINTS = [
  {
    title: "Access and parking",
    body: "Tell us about stairs, lifts, loading bays, permits, narrow streets and long carrying distances before the quote is confirmed.",
  },
  {
    title: "Load size",
    body: "A few boxes, a studio, a full house and an office move need different van and crew planning. Photos help with bulky items.",
  },
  {
    title: "Timing",
    body: "Weekend, month-end, same-day and long-distance moves need more planning than flexible weekday jobs.",
  },
  {
    title: "Service fit",
    body: "Man and van suits small moves; house removals fit full homes; furniture delivery is best for single bulky items.",
  },
];

const FAQS = [
  {
    question: "How do I get a quote?",
    answer:
      "Choose a service above and add the addresses, access details, items and date. Review the available quote before payment. Call us on 07909 032889 for complex moves or if an online quote is unavailable.",
  },
  {
    question: "How far in advance do I need to book?",
    answer:
      "For weekday moves, 24–48 hours' notice is usually sufficient. For weekend moves — especially at month ends — we recommend booking 2–4 weeks ahead. Same-day bookings are accepted subject to availability.",
  },
  {
    question: "Are my belongings insured during the move?",
    answer:
      "Ask the team to confirm the goods-in-transit cover, limits and exclusions for your booking. Declare fragile and higher-value items in advance and obtain any additional arrangements in writing.",
  },
  {
    question: "What areas of Scotland do you cover?",
    answer:
      "Our service-area pages include Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and other Scottish towns. Give us both postcodes so the route and availability can be checked before a booking is confirmed.",
  },
  {
    question: "Do you offer fixed prices or hourly rates?",
    answer:
      "Both. Man and van bookings are typically hourly. Full house and office removals can be quoted at a fixed price after a brief survey. We'll recommend the best option for your move.",
  },
  {
    question: "Do you move between Scottish cities?",
    answer:
      "We can quote for intercity moves such as Glasgow to Edinburgh or Dundee to Stirling. The collection and delivery addresses, load, access and date determine whether the route can be scheduled and the price agreed.",
  },
  {
    question: "What if my move takes longer than expected?",
    answer:
      "Check the agreed scope and charging basis before booking. Tell the team about delayed keys, extra items or changed access as soon as possible so any effect on time or price can be discussed.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <JsonLd
        id="home-jsonld"
        data={[
          buildLocalBusinessSchema(),
          buildWebsiteSchema(),
          buildServiceCatalogSchema(SEO_SERVICE_CATALOG_ITEMS),
          buildFaqSchema(FAQS),
        ]}
      />
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 5% 50%, rgba(180,83,9,0.20) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 95% 20%, rgba(234,88,12,0.10) 0%, transparent 55%), " +
            "linear-gradient(160deg, #0A0A0A 0%, #130B00 55%, #0A0500 100%)",
        }}
        aria-labelledby="hero-heading"
      >
        {/* Moving road animation */}
        <div className="hero-road" aria-hidden="true">
          <div className="hero-road-lines" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:py-20 lg:py-32">
          <div className="max-w-5xl">
            <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-widest mb-4 sm:mb-6" style={{ backgroundColor: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.20)" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              <span>GLASGOW · EDINBURGH · DUNDEE · ABERDEEN · ACROSS SCOTLAND</span>
            </div>

            <TypingHeroHeading
              id="hero-heading"
              prefix="Man and Van Services "
              highlight="Across Scotland"
              className="hero-fade-up hero-fade-up-2 text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
            />

            <p className="hero-fade-up hero-fade-up-3 mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              House moves, office removals, single items, furniture delivery and
              same-day transport — from {money.format(45)}/hr. Fixed prices
              available. Goods-in-transit cover included as standard.
            </p>

            <section
              id="get-quote"
              className="hero-fade-up hero-fade-up-4 mt-7 sm:mt-10"
              aria-labelledby="hero-service-heading"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-amber-400">
                    Step 1 of 5 · Service
                  </p>
                  <h2
                    id="hero-service-heading"
                    className="mt-1 text-2xl font-extrabold leading-tight text-white sm:text-3xl"
                  >
                    What do you need moved?
                  </h2>
                </div>
              </div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="list">
                {BOOKING_SERVICE_OPTIONS.map((choice, idx) => {
                  const pricedService = SERVICES.find((service) => service.slug === choice.serviceSlug);
                  const imageSrc = getServiceImage(choice.imageSlug);

                  return (
                    <li key={choice.id} className="min-w-0">
                      <Link
                        href={`/book?service=${choice.id}`}
                        data-track-event="quote_click"
                        data-track-location={`hero_service_${choice.id}`}
                        className="hero-service-card group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:min-h-[220px]"
                        style={{ animationDelay: `${idx * 0.55}s` }}
                      >
                        <Image
                          src={imageSrc}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                          priority={idx === 0}
                          fetchPriority={idx === 0 ? "high" : undefined}
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/20 to-black/10" aria-hidden="true" />

                        {/* Arrow icon — top right, subtle amber on hover */}
                        <span
                          className="absolute right-3 top-3 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/40 text-xs font-bold text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-400 group-hover:text-stone-950 group-hover:scale-110"
                          aria-hidden="true"
                        >
                          →
                        </span>

                        {/* Content — pinned to bottom */}
                        <div className="relative z-10 mt-auto p-4">
                          <span className="block text-sm font-bold leading-snug text-white">
                            {choice.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-white/65">
                            {choice.description}
                          </span>
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {pricedService && (
                              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-stone-950">
                                From {getServicePriceLabel(pricedService)}
                              </span>
                            )}
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                              {choice.pathBadge}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-sm font-medium text-slate-300">
                Choose a service to continue with addresses, inventory, schedule, and payment.
              </p>
            </section>

            {/* Urgency badge */}
            <div className="hero-fade-up hero-fade-up-4 mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500/12 border border-amber-400/30 px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-amber-300 urgency-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              Same-day enquiries · Capacity checked before confirmation
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
                "Online Quotes",
                "Scottish Coverage",
                "Goods-in-Transit Cover",
                "Homes, Flats & Offices",
              ].map((badge, i) => (
                <li
                  key={badge}
                  className={`trust-badge trust-badge-${i + 1} inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-300`}
                >
                  <span className="inline-block w-1 h-1 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Curved transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-8 sm:h-12"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0A0A0A"
            d="M0,60 L0,30 C240,60 480,0 720,15 C960,30 1200,60 1440,20 L1440,60 Z"
          />
        </svg>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section
        className="relative z-10"
        style={{ background: "rgba(245,158,11,0.08)", borderTop: "1px solid rgba(245,158,11,0.15)", borderBottom: "1px solid rgba(245,158,11,0.15)" }}
        aria-label="Service highlights"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-0" role="list">
            {TRUST_STATS.map((stat, i) => (
              <li
                key={stat.label}
                className={`flex flex-col items-center text-center px-2 ${
                  i < TRUST_STATS.length - 1 ? "md:border-r md:border-amber-500/20" : ""
                }`}
              >
                <span className="flex items-baseline justify-center gap-1 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-3xl md:text-4xl font-black text-transparent leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400/60">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Customer shortcuts ────────────────────────────────────────────── */}
      <section
        className="py-14 sm:py-16"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="customer-shortcuts-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-400">
                Quick routes
              </p>
              <h2 id="customer-shortcuts-heading" className="mt-2 scroll-mt-28 text-2xl font-black text-white sm:text-3xl">
                Choose the path that fits your move
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/50">
              Fast options for common situations, especially when booking from a phone.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {CUSTOMER_PATHS.map((path) => {
              const content = (
                <span className="flex h-full flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-amber-400">
                    {path.eyebrow}
                  </span>
                  <span className="mt-2 text-lg font-black text-white">
                    {path.title}
                  </span>
                  <span className="mt-2 text-sm leading-6 text-white/55">
                    {path.body}
                  </span>
                  <span className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-black text-black transition group-hover:brightness-110" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
                    {path.cta} <span className="ml-1" aria-hidden="true">→</span>
                  </span>
                </span>
              );

              if (path.external) {
                return (
                  <li key={path.title}>
                    <a
                      href={path.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track-event="shortcut_click"
                      data-track-location={`shortcut_${path.title.toLowerCase().replace(/\s+/g, "_")}`}
                      className="customer-path-card group block h-full rounded-2xl p-5 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      {content}
                    </a>
                  </li>
                );
              }

              if (path.href.startsWith("tel:")) {
                return (
                  <li key={path.title}>
                    <a
                      href={path.href}
                      data-track-event="shortcut_click"
                      data-track-location={`shortcut_${path.title.toLowerCase().replace(/\s+/g, "_")}`}
                      className="customer-path-card group block h-full rounded-2xl p-5 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      {content}
                    </a>
                  </li>
                );
              }

              return (
                <li key={path.title}>
                  <Link
                    href={path.href}
                    data-track-event="shortcut_click"
                    data-track-location={`shortcut_${path.title.toLowerCase().replace(/\s+/g, "_")}`}
                    className="customer-path-card group block h-full rounded-2xl p-5 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {content}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Instant quote calculator ──────────────────────────────────────── */}
      <InstantQuoteCalculator />

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section
        id="services"
        className="py-20"
        style={{ background: "#0A0A0A" }}
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="services-heading" className="section-heading">
              Everything You Need to Move
            </h2>
            <p className="section-subheading mx-auto">
              From a single item to an entire office, we have a service that fits.
              Check what is included, access requirements and the agreed quote before booking.
            </p>
          </div>

          <ul
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
          >
            {SERVICES.filter((service) => service.indexable !== false).map((service) => (
              <li key={service.slug}>
                <ServiceImageCard
                  slug={service.slug}
                  title={service.name}
                  description={service.description}
                  price={`From ${getServicePriceLabel(service)}`}
                  imagePath={getServiceImage(service.slug)}
                  href={`/services/${service.slug}`}
                  variant="homepage"
                />
              </li>
            ))}
            <li>
              {/* European Removals — custom image card with "New" badge */}
              <div className="relative">
                <span className="absolute -top-2 right-4 z-20 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow" style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}>
                  New
                </span>
                <ServiceImageCard
                  slug="european-removals"
                  title="European Removals"
                  description="Moving abroad? Door-to-door removals to Europe with packing options and paperwork support."
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
        className="py-20"
        style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.10)" }}
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
            <div
              className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5"
              style={{ background: "rgba(245,158,11,0.25)" }}
              aria-hidden="true"
            />
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.step} className={`reveal step-card step-card-${i + 1} flex flex-col items-center text-center`}>
                <div
                  className="step-badge relative z-10 flex items-center justify-center w-20 h-20 rounded-full text-black text-3xl font-black mb-6 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-black text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/55 leading-relaxed">
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
        className="py-20"
        style={{ background: "#0A0A0A" }}
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
                <h3 className="text-base font-bold text-amber-400/70 mb-4 flex items-center gap-2">
                  <span aria-hidden="true">📍</span> {region}
                </h3>
                <ul className="reveal-stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" role="list">
                  {regionAreas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={`/areas/${area.slug}`}
                        data-track-event="area_card_click"
                        data-track-location={`areas_${area.slug}`}
                        className="area-link-card block text-center py-2.5 px-3 rounded-lg text-sm font-medium text-white/60 transition-all hover:text-amber-400"
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
        className="py-20"
        style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.10)" }}
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="section-heading">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              No hidden fees, no surprise charges. Your confirmed quote is
              shown before you book, based on the route, access, load and date.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {PRICING_TIERS.map((tier) => (
              <li
                key={tier.size}
                className="tier-lift relative rounded-2xl p-6"
                style={tier.popular
                  ? { background: "linear-gradient(135deg, rgba(245,158,11,0.20) 0%, rgba(234,88,12,0.15) 100%)", boxShadow: "0 0 0 2px rgba(245,158,11,0.50), 0 20px 60px rgba(245,158,11,0.15)" }
                  : { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-black px-3 py-1 rounded-full text-black" style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-3xl mb-3" aria-hidden="true">{tier.icon}</div>
                <h3 className="font-black text-xl text-white">{tier.size}</h3>
                <p className="text-sm mt-1 text-white/50">{tier.capacity}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-white">{money.format(tier.price)}</span>
                  <span className="text-sm text-white/70">/hr</span>
                </div>
                <ul className="space-y-2" role="list">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                      <svg className="w-4 h-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  data-track-event="quote_click"
                  data-track-location={`pricing_tier_${tier.size.toLowerCase().replace(/\s+/g, "_")}`}
                  className="mt-6 block w-full text-center py-2.5 rounded-xl font-black text-sm text-black transition hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
                >
                  Book {tier.size}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-white/70">
            All prices are per hour. Minimum 2-hour booking. Fixed-price quotes available for house removals.
          </p>
        </div>
      </section>

      {/* ── Service comparison ─────────────────────────────────────────── */}
      <ServiceComparison />

      {/* ── Move planning ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A0A0A" }} aria-labelledby="planning-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="planning-heading" className="section-heading">
              What Makes a Quote Accurate?
            </h2>
            <p className="section-subheading mx-auto">
              A better quote starts with the details that change the work on move day.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
            {MOVE_DECISION_POINTS.map((point) => (
              <li key={point.title} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
                <h3 className="font-black text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-20"
        style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.10)" }}
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
        className="py-20"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(245,158,11,0.12) 0%, transparent 70%), #0A0A0A", borderTop: "1px solid rgba(245,158,11,0.15)" }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="mx-auto max-w-2xl text-2xl font-black leading-tight text-white sm:text-4xl">
            Ready for a Stress-Free Move?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
            Get a free, no-obligation quote for a local move, full-house removal, furniture delivery, or office relocation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              data-track-event="call_click"
              data-track-location="footer_cta"
              className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <Image src="/call-icon.png" alt="Call us" width={64} height={64} />
            </a>
            <a
              href="mailto:hello@speedyvan.uk"
              data-track-event="email_click"
              data-track-location="footer_cta"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold text-white/70 text-base transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}
            >
              hello@speedyvan.uk
            </a>
            <Link
              href="/book"
              data-track-event="quote_click"
              data-track-location="footer_cta"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-black text-black text-base transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Book Now →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
