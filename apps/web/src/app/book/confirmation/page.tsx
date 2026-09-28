import type { Metadata } from "next";
import Link from "next/link";
import { FiCheck, FiClock, FiMail, FiTruck } from "react-icons/fi";
import { ConfirmationActions } from "./ConfirmationActions";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

const nextSteps = [
  {
    title: "Confirmation sent",
    body: "Your booking details and payment receipt are emailed.",
    icon: FiMail,
  },
  {
    title: "Crew assigned",
    body: "We match the job to the right driver and van.",
    icon: FiTruck,
  },
  {
    title: "Live updates",
    body: "Track status changes from your booking page.",
    icon: FiClock,
  },
];

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const ref = (Array.isArray(query.ref) ? query.ref[0] : query.ref) ?? "";

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center gap-5">
        <Link href="/" className="inline-flex w-fit items-center gap-3 text-xl font-black text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-black shadow-[0_0_28px_rgba(245,158,11,0.32)]">
            SV
          </span>
          Speedy<span className="-ml-2 text-amber-400">Van</span>
        </Link>

        <section className="rounded-[28px] border border-amber-500/20 bg-[#14130f] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/[0.14] text-emerald-300 ring-1 ring-emerald-300/25">
                <FiCheck aria-hidden="true" className="h-8 w-8" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                Payment complete
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Booking confirmed
              </h1>
              <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-white/75">
                Keep your reference safe. Download the invoice or track the booking when you need updates.
              </p>
            </div>

            {ref && (
              <div className="rounded-2xl border border-white/10 bg-black/[0.24] px-5 py-4 text-left sm:min-w-[260px]">
                <p className="text-xs font-black uppercase tracking-widest text-white/50">
                  Booking reference
                </p>
                <p className="mt-2 break-all font-mono text-2xl font-black tracking-widest text-white">
                  {ref}
                </p>
              </div>
            )}
          </div>
        </section>

        <ConfirmationActions reference={ref} />

        <section className="grid gap-3 sm:grid-cols-3">
          {nextSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <Icon aria-hidden="true" className="h-5 w-5 text-amber-300" />
                <h2 className="mt-3 text-sm font-black text-white">{step.title}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-white/60">{step.body}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
