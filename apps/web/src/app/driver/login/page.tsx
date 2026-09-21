"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, getUser } from "@/lib/auth-client";

function getDriverReturnUrl(value: string | null): string {
  const fallback = "/driver/dashboard";
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return fallback;

  try {
    const url = new URL(value, "https://driver.invalid");
    const routes = new Set(["/jobs", "/driver/dashboard", "/driver/my-jobs", "/driver/stats", "/driver/messages", "/driver/earnings"]);
    if (url.origin !== "https://driver.invalid") return fallback;
    if (!routes.has(url.pathname) && !/^\/driver\/my-jobs\/[a-zA-Z0-9_-]+$/.test(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

function DriverLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = getDriverReturnUrl(params.get("returnUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    const user = getUser();
    if (user?.role === "DRIVER") router.replace(returnUrl);
  }, [returnUrl, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting.current) return;
      submitting.current = true;
      setError("");
      setLoading(true);
      try {
        await login(email.trim(), password);
        const user = getUser();
        if (user?.role !== "DRIVER") {
          setError("This login is for drivers only.");
          return;
        }
        router.push(returnUrl);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Invalid email or password");
      } finally {
        submitting.current = false;
        setLoading(false);
      }
    },
    [email, password, returnUrl, router],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚛</div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Speedy Van</h1>
          <p className="text-white/55 text-sm mt-1">Driver Portal</p>
        </div>

        <form onSubmit={handleSubmit} aria-busy={loading} className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
          {error && (
            <div role="alert" className="bg-red-900/50 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="driver-login-email" className="block text-sm font-medium text-white/55 mb-1.5">Email</label>
            <input
              id="driver-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-xl text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-white/30"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="driver-login-password" className="block text-sm font-medium text-white/55 mb-1.5">Password</label>
            <input
              id="driver-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-white/30"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-black font-black py-3.5 rounded-xl text-base transition-opacity disabled:opacity-50 min-h-[52px]"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Not a driver?{" "}
          <a href="/jobs" className="text-amber-400 hover:text-amber-300 font-medium">View available jobs</a>
        </p>

        <div className="text-center mt-4">
          <a
            href="https://apps.apple.com/gb/app/speedy-van-driver/id6753916830"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-xs transition-colors"
          >
            🍎 Download the iOS Driver App
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DriverLoginPage() {
  return (
    <Suspense fallback={<p role="status" className="p-6 text-center">Loading driver sign-in…</p>}>
      <DriverLoginForm />
    </Suspense>
  );
}
