import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import EuropeanEnquiryForm from "@/components/european/EuropeanEnquiryForm";
import {
  EUROPEAN_COUNTRIES,
  INDICATIVE_PRICES,
} from "@/lib/european";
import { SITE_LEGAL_NAME, SITE_URL } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export const metadata: Metadata = buildPageMetadata({
  title: "European Removals from Scotland",
  description:
    "Door-to-door European removals from Scotland to France, Germany, Spain, Netherlands, Ireland and more. Packing options, customs paperwork support and written quotes.",
  path: "/services/european-removals",
});

const FEATURES = [
  {
    icon: "🚚",
    title: "Door-to-Door Service",
    body: "We collect from your Scottish address and deliver right to your new European home.",
  },
  {
    icon: "📦",
    title: "Full Packing Service",
    body: "Optional professional packing with European-grade materials for international transit.",
  },
  {
    icon: "📋",
    title: "Customs Paperwork Support",
    body: "We help plan the inventory and documentation needed for post-Brexit personal-effects moves.",
  },
  {
    icon: "🛡️",
    title: "Cover Confirmed in Writing",
    body: "Insurance and declared-value requirements are confirmed as part of the written quote.",
  },
  {
    icon: "🇪🇺",
    title: "Any EU Country",
    body: "Direct routes to 20+ European countries — from Ireland to Greece, Portugal to Finland.",
  },
  {
    icon: "📅",
    title: "Flexible Scheduling",
    body: "Pick a fixed date or stay flexible — we'll match the route that works best for you.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Submit your enquiry",
    body: "Tell us where you're moving from, where you're going, and what you need to bring.",
  },
  {
    n: 2,
    title: "Get a written quote",
    body: "We'll review your details and send a clear quote covering route, volume, timing and any extra support.",
  },
  {
    n: 3,
    title: "Confirm and we plan everything",
    body: "Once you accept, we plan packing, route, customs paperwork and timing end-to-end.",
  },
  {
    n: 4,
    title: "We pack, drive and deliver",
    body: "Our team handles the move from your Scottish door to your new European address.",
  },
];

const FAQS = [
  {
    q: "How long does a European move from Scotland take?",
    a: "Transit times vary by destination. Ireland is typically 2–3 days, France/Netherlands 3–5 days, Germany/Belgium 4–6 days, Spain/Italy 5–8 days, and Eastern or Northern Europe 7–10 days from collection.",
  },
  {
    q: "Do you handle customs paperwork after Brexit?",
    a: "We help prepare the inventory and paperwork required for personal effects entering the EU. Requirements vary by country, so the exact support is confirmed in your quote.",
  },
  {
    q: "Is my stuff insured during the journey?",
    a: "Cover depends on the route, carrier arrangement and declared value. Mention higher-value items in your enquiry so the quote can set out the available options.",
  },
  {
    q: "Can you move just a few items, not a full house?",
    a: "Yes. We run part-load European routes that share van space across customers, so even a single sofa or a few boxes to Europe can be quoted at a fair fixed price.",
  },
  {
    q: "Do you offer storage if my new place isn't ready?",
    a: "Storage can be included where available through the route plan. Tick the storage box on the enquiry form and we'll confirm options in your quote.",
  },
  {
    q: "What about pianos, motorbikes or other large items?",
    a: "Large or specialist items must be declared in the enquiry notes. We will confirm whether they can be moved safely, what equipment is needed, and whether extra cover is available.",
  },
];

export default function EuropeanRemovalsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "European Removals from Scotland",
      description:
        "Door-to-door international removals from Scotland to Europe with packing options, customs paperwork support and written quotes.",
      provider: {
        "@type": "MovingCompany",
        name: SITE_LEGAL_NAME,
        url: SITE_URL,
      },
      areaServed: [
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Spain" },
        { "@type": "Country", name: "Netherlands" },
        { "@type": "Country", name: "Ireland" },
      ],
      serviceType: "International Moving",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <JsonLd id="european-removals-jsonld" data={jsonLd} />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #0D0D0D 60%, #0A0A0A 100%)" }}
      >
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" style={{ background: "#F59E0B" }} />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl" style={{ background: "#EA580C" }} />
        </div>
        <div className="relative container mx-auto px-4 py-20 sm:py-28 max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300">
            🇪🇺 International Removals
          </p>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            European Removals from{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Scotland
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            Door-to-door international moves to <strong className="text-white">20+ European countries</strong>.
            Packing options, customs paperwork support and a written quote before you commit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-lg px-7 py-4 text-base font-black text-black transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                boxShadow: "0 0 32px rgba(245,158,11,0.30)",
              }}
            >
              Get a Free Quote ↓
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            {[
              { v: "20+", l: "Countries" },
              { v: "Quote", l: "In writing" },
              { v: "Cover", l: "Confirmed by route" },
              { v: "Door", l: "To door" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl px-3 py-4 backdrop-blur"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{s.v}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20" style={{ background: "#0A0A0A" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Everything sorted, end-to-end
            </h2>
            <p className="mt-3 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              From your Scottish doorstep to your new European home — we plan route, packing options,
              paperwork and delivery timing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <div className="text-3xl mb-3" aria-hidden="true">
                  {f.icon}
                </div>
                <h3 className="text-lg font-black text-white">{f.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 sm:py-20" style={{ background: "rgba(245,158,11,0.04)" }}>
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            We move to 20+ European countries
          </h2>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            Don&apos;t see your destination? Just ask — we cover most of mainland Europe.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {EUROPEAN_COUNTRIES.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15)",
                  color: "rgba(255,255,255,0.70)",
                }}
              >
                <span className="text-base" aria-hidden="true">
                  {c.flag}
                </span>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20" style={{ background: "#0A0A0A" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How a European move with Speedy Van works
            </h2>
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              Different to a local move — quoted by hand, planned end-to-end.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="absolute -top-4 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-black shadow-md"
                  style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-black text-white">{s.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indicative pricing */}
      <section className="py-16 sm:py-20" style={{ background: "rgba(245,158,11,0.04)" }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Indicative pricing
            </h2>
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              Starting prices for a typical 1-bedroom move. Your final quote depends on volume,
              packing, customs paperwork, access and timing.
            </p>
          </div>
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <table className="w-full text-left">
              <thead
                className="text-xs uppercase tracking-wider"
                style={{ background: "rgba(245,158,11,0.08)", color: "rgba(255,255,255,0.55)" }}
              >
                <tr>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3 text-right">From</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {INDICATIVE_PRICES.map((p) => (
                  <tr
                    key={p.destination}
                    style={{ borderTop: "1px solid rgba(245,158,11,0.08)" }}
                  >
                    <td className="px-5 py-3 font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>{p.destination}</td>
                    <td className="px-5 py-3 text-right font-black text-amber-400">
                      {money.format(p.fromPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
            All prices in GBP. Indicative only — your fixed quote will be confirmed in writing.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20" style={{ background: "#0A0A0A" }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-amber-900/20 p-5 open:shadow-md"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-base font-black text-white">
                  {f.q}
                  <span className="text-xl text-amber-400 transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="py-16 sm:py-20" style={{ background: "rgba(245,158,11,0.04)" }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <EuropeanEnquiryForm />
        </div>
      </section>
    </>
  );
}
