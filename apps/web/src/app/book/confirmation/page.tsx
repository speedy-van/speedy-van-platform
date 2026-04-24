import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed | SpeedyVan",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { ref?: string };
}

export default function ConfirmationPage({ searchParams }: PageProps) {
  const ref = searchParams.ref || "";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        {/* Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-600 mb-6">
          Your van is booked. We&apos;ve sent a confirmation to your email.
        </p>

        {ref && (
          <div className="bg-slate-100 rounded-xl px-6 py-4 mb-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Booking reference
            </p>
            <p className="text-xl font-bold text-slate-900 font-mono tracking-widest">
              {ref}
            </p>
          </div>
        )}

        <div className="text-sm text-slate-600 mb-8 space-y-1">
          <p>A driver will be assigned shortly and you&apos;ll receive</p>
          <p>a notification when they&apos;re on their way.</p>
        </div>

        <div className="flex flex-col gap-3">
          {ref && (
            <Link
              href={`/track?ref=${ref}`}
              className="btn-primary py-3 rounded-xl text-sm font-semibold text-center"
            >
              Track my booking
            </Link>
          )}
          <Link
            href="/"
            className="btn-secondary py-3 rounded-xl text-sm font-semibold text-center"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
