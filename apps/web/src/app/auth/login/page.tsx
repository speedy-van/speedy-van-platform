import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your SpeedyVan account to manage bookings and track your moves.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" aria-label="Go to SpeedyVan home">
            <Logo className="inline-flex h-10" />
          </Link>
          <h1 className="mt-6 text-2xl font-black text-white">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Manage your bookings, track moves, and more
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-amber-900/20 p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-white/55">
          Don&apos;t have an account?{" "}
          <a href="tel:07909032889" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Call us to get started
          </a>
        </p>

        <p className="mt-3 text-center">
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
