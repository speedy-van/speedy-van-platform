import type { Metadata } from "next";
import Link from "next/link";
import { InvoiceButton } from "./InvoiceButton";
import { SITE_EMAIL, SITE_LEGAL_NAME, SITE_PHONE_DISPLAY } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "SpeedyVan booking confirmation, invoice access, support contact details and next steps after payment.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

const nextSteps = [
  {
    title: "Payment received",
    body: "Your card payment is complete and your booking reference has been created.",
  },
  {
    title: "Move details reviewed",
    body: "The team checks route, access notes, timing, and any special handling details.",
  },
  {
    title: "Driver assigned",
    body: "You will receive updates when a driver is assigned and when the van is on the way.",
  },
];

const confirmationDetails = [
  { label: "Payment status", value: "Paid and confirmed" },
  { label: "Invoice", value: "Available as a PDF" },
  { label: "Provider", value: `${SITE_LEGAL_NAME} trading as SpeedyVan` },
  { label: "Support", value: `${SITE_PHONE_DISPLAY} · ${SITE_EMAIL}` },
];

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const ref = (Array.isArray(query.ref) ? query.ref[0] : query.ref) ?? "";
  const isLocalDevBooking = ref.startsWith("DEV-");

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400 text-xl font-black text-black">S</span>
            <span>
              <span className="block text-lg font-black">SpeedyVan</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-amber-300/70">Secure online booking</span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
                {SITE_LEGAL_NAME}
              </span>
            </span>
          </Link>
          <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
            Payment complete
          </div>
        </header>

        <section className="mb-8">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/25">
            <svg className="h-10 w-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-amber-300/80">Booking confirmed</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your move is confirmed.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-white/62">
            Your payment has been accepted and your invoice is ready. Keep your booking reference handy for tracking, changes, or support.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-amber-400/25 bg-white/[0.045] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.48)] sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300/75">Booking reference</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <p className="break-all font-mono text-3xl font-black tracking-widest text-white sm:text-4xl">
                {ref || "Reference pending"}
              </p>
              {isLocalDevBooking && (
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-black uppercase tracking-widest text-white/45">
                  Local test
                </span>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
              We will use this reference if you contact us about the booking. Live bookings can also be tracked online.
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {confirmationDetails.map((detail) => (
                <div key={detail.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <dt className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-300/70">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold leading-6 text-white/72">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>

            <InvoiceButton reference={ref} isLocalDevBooking={isLocalDevBooking} />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {ref && !isLocalDevBooking && (
                <Link
                  href={`/track?ref=${encodeURIComponent(ref)}`}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 text-sm font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
                >
                  Track booking
                </Link>
              )}
              <Link
                href="/book"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/12 bg-white/6 px-5 text-sm font-black text-white/75 transition hover:border-amber-400/35 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Start another quote
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/12 bg-white/4 px-5 text-sm font-black text-white/55 transition hover:border-white/25 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Home
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.38)] sm:p-6">
            <h2 className="text-lg font-black text-white">Need to change something?</h2>
            <p className="mt-2 text-sm leading-6 text-white/52">
              Call or message us with your reference if addresses, access, items, or timings need checking.
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href="tel:07909032889"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-black text-black transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Call 07909 032889
              </a>
              <a
                href="https://wa.me/447909032889"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-5 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                WhatsApp us
              </a>
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-sm font-black text-black">
                {index + 1}
              </div>
              <h2 className="text-base font-black text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">{step.body}</p>
            </article>
          ))}
        </section>

        {isLocalDevBooking && (
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-white/38">
            Local test mode: Stripe payment succeeded. Tracking and stored booking records require a configured local database.
          </p>
        )}
      </div>
    </main>
  );
}
