"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, getUser } from "@/lib/auth-client";

function DriverLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") ?? "/driver/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user?.role === "DRIVER") router.replace(returnUrl);
  }, [returnUrl, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
        setLoading(false);
      }
    },
    [email, password, returnUrl, router],
  );

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚛</div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Speedy Van</h1>
          <p className="text-slate-400 text-sm mt-1">Driver Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-xl bg-slate-700 border border-slate-600 text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl bg-slate-700 border border-slate-600 text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3.5 rounded-xl text-base transition-colors disabled:opacity-50 min-h-[52px]"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          Not a driver?{" "}
          <a href="/jobs" className="text-yellow-400 hover:text-yellow-300 font-medium">View available jobs</a>
        </p>

        <div className="text-center mt-4">
          <a
            href="https://apps.apple.com/gb/app/speedy-van-driver/id6753916830"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-300 text-xs transition-colors"
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
    <Suspense>
      <DriverLoginForm />
    </Suspense>
  );
}
