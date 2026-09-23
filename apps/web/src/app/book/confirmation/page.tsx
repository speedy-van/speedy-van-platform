import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ref?: string | string[] }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const ref = (Array.isArray(query.ref) ? query.ref[0] : query.ref) ?? "";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-12 px-4">
      <div
        className="max-w-md w-full rounded-3xl border border-amber-900/20 p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 mb-6">
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h1>
        <p className="text-white/55 mb-6">
          Your van is booked. We&apos;ve sent a confirmation to your email.
        </p>

        {ref && (
          <div className="rounded-xl px-6 py-4 mb-6 border border-amber-900/20" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">
              Booking reference
            </p>
            <p className="text-xl font-black text-white font-mono tracking-widest">
              {ref}
            </p>
          </div>
        )}

        <div className="text-sm text-white/55 mb-8 space-y-1">
          <p>A driver will be assigned shortly and you&apos;ll receive</p>
          <p>a notification when they&apos;re on their way.</p>
        </div>

        <div className="flex flex-col gap-3">
          {ref && (
            <Link
              href={`/track?ref=${encodeURIComponent(ref)}`}
              className="py-3 rounded-xl text-sm font-black text-black text-center transition hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Track my booking
            </Link>
          )}
          <Link
            href="/"
            className="py-3 rounded-xl text-sm font-black text-white/55 text-center border border-amber-900/20 transition hover:border-amber-500/30 hover:text-white/80"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
