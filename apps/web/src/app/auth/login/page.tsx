import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In | SpeedyVan",
  description: "Sign in to your SpeedyVan account to manage bookings and track your moves.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" aria-label="Go to SpeedyVan home">
            <Logo className="inline-flex h-10" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your bookings, track moves, and more
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <a href="tel:+442012345678" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
            Call us to get started
          </a>
        </p>

        <p className="mt-3 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
