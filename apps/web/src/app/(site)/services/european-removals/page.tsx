import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import EuropeanEnquiryForm from "@/components/european/EuropeanEnquiryForm";
import {
  EUROPEAN_COUNTRIES,
  INDICATIVE_PRICES,
} from "@/lib/european";

export const metadata: Metadata = {
  title: "European Removals from Scotland | Speedy Van",
  description:
    "Door-to-door European removals from Scotland to France, Germany, Spain, Netherlands, Ireland and 15+ more countries. Full packing, customs handled, fully insured. Get a free quote within 24 hours.",
  alternates: { canonical: "https://www.speedy-van.co.uk/services/european-removals" },
  openGraph: {
    title: "European Removals from Scotland — Speedy Van",
    description:
      "Door-to-door international moves to 20+ European countries. Full packing, customs handled, fully insured.",
    url: "https://www.speedy-van.co.uk/services/european-removals",
    type: "website",
  },
};

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
    title: "Customs Handled",
    body: "We handle all customs paperwork, declarations and post-Brexit documentation.",
  },
  {
    icon: "🛡️",
    title: "International Insurance",
    body: "Comprehensive goods-in-transit cover for the full journey, every kilometre.",
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
    title: "Get a free fixed-price quote",
    body: "We'll review your details and email a detailed, transparent quote within 24 hours.",
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
    a: "Yes. We complete all customs declarations, transit documents and the inventory paperwork required for personal effects entering the EU. You don't need to deal with customs forms yourself.",
  },
  {
    q: "Is my stuff insured during the journey?",
    a: "Every European move includes goods-in-transit insurance covering the full international journey. Higher-value items can be declared for additional cover — just mention them in your enquiry.",
  },
  {
    q: "Can you move just a few items, not a full house?",
    a: "Yes. We run part-load European routes that share van space across customers, so even a single sofa or a few boxes to Europe can be quoted at a fair fixed price.",
  },
  {
    q: "Do you offer storage if my new place isn't ready?",
    a: "Yes — we offer short and long-term storage in the UK or at the destination. Tick the storage box on the enquiry form and we'll include it in your quote.",
  },
  {
    q: "What about pianos, motorbikes or other large items?",
    a: "We move pianos, motorbikes, large artwork, antiques and oversized furniture across Europe regularly. Mention them in the notes and we'll plan the right equipment and crew.",
  },
];

export default function EuropeanRemovalsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "European Removals from Scotland",
      description:
        "Door-to-door international removals from Scotland to 20+ European countries with full packing, customs handling and insurance.",
      provider: {
        "@type": "MovingCompany",
        name: "Speedy Van",
        url: "https://www.speedy-van.co.uk",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-400 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 sm:py-28 max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-200">
            🇪🇺 International Removals
          </p>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            European Removals from{" "}
            <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              Scotland
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
            Door-to-door international moves to <strong className="text-white">20+ European countries</strong>.
            Full packing, customs handled, fully insured — quoted in 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-7 py-4 text-base font-extrabold text-slate-900 shadow-xl shadow-primary-400/30 transition-transform hover:scale-105"
            >
              Get a Free Quote ↓
            </Link>
            <a
              href="tel:01202129746"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              📞 01202 129746
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            {[
              { v: "20+", l: "Countries" },
              { v: "24h", l: "Quote turnaround" },
              { v: "100%", l: "Insured" },
              { v: "10+", l: "Years experience" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-300">{s.v}</div>
                <div className="text-xs text-slate-300 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything sorted, end-to-end
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              From your Scottish doorstep to your new European home — we plan, pack, drive and clear customs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="text-3xl mb-3" aria-hidden="true">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            We move to 20+ European countries
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Don&apos;t see your destination? Just ask — we cover most of mainland Europe.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {EUROPEAN_COUNTRIES.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
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
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How a European move with Speedy Van works
            </h2>
            <p className="mt-3 text-slate-600">
              Different to a local move — quoted by hand, planned end-to-end.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="absolute -top-4 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-400 text-sm font-extrabold text-slate-900 shadow-md">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indicative pricing */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Indicative pricing
            </h2>
            <p className="mt-3 text-slate-600">
              Starting prices for a typical 1-bedroom move. Your final quote depends on volume,
              packing, customs and timing — sent within 24 hours of your enquiry.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3 text-right">From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                {INDICATIVE_PRICES.map((p) => (
                  <tr key={p.destination}>
                    <td className="px-5 py-3 font-semibold">{p.destination}</td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900">
                      £{p.fromPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            All prices in GBP. Indicative only — your fixed quote will be confirmed in writing.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-base font-bold text-slate-900">
                  {f.q}
                  <span className="text-xl text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <EuropeanEnquiryForm />
        </div>
      </section>
    </>
  );
}
