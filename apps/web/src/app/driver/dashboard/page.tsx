"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth-client";
import { JobCard, type DriverJobCard } from "@/components/driver/JobCard";
import { DriverTopBar } from "@/components/driver/DriverTopBar";
import { LocationToggle } from "@/components/driver/LocationToggle";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

interface DashboardData {
  todayJobs: number;
  todayEarnings: number;
  totalCompletedJobs: number;
  nextJob?: DriverJobCard;
  weekStats?: { week: number; earnings: number };
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl p-4 flex-1 min-w-0" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
      <p className="text-xs text-white/55 font-medium">{label}</p>
      <p className="text-2xl font-black text-white mt-1 font-mono truncate">{value}</p>
    </div>
  );
}

export default function DriverDashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem("sv-auth-token");
      try {
        const res = await fetch(`${API_BASE}/driver/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Driver";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <DriverTopBar title="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/55">{greeting}</p>
            <p className="text-2xl font-black text-white">{firstName} 👋</p>
          </div>
          <LocationToggle />
        </div>

        {/* KPIs */}
        <div className="flex gap-3">
          <KpiCard label="Today's Jobs" value={loading ? "…" : data?.todayJobs ?? 0} />
          <KpiCard label="Today's Earnings" value={loading ? "…" : `£${(data?.todayEarnings ?? 0).toFixed(2)}`} />
          <KpiCard label="Completed" value={loading ? "…" : data?.totalCompletedJobs ?? 0} />
        </div>

        {/* This week earnings */}
        {data?.weekStats && data.weekStats.earnings > 0 && (
          <div className="rounded-2xl p-4 text-white" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
            <p className="text-xs text-white/55">This week (Week {data.weekStats.week})</p>
            <p className="text-3xl font-black font-mono text-amber-400 mt-1">
              £{data.weekStats.earnings.toFixed(2)}
            </p>
          </div>
        )}

        {/* Next job */}
        {loading ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
            <div className="h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : data?.nextJob ? (
          <div>
            <p className="text-sm font-bold text-white/55 mb-2">Next Job</p>
            <JobCard job={data.nextJob} compact />
            <div className="flex gap-3 mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.nextJob.booking.pickupAddress ?? data.nextJob.booking.pickupPostcode)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-black font-black text-sm py-3 rounded-xl text-center transition-opacity min-h-[48px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
              >
                🗺️ Navigate
              </a>
              <button
                onClick={() => router.push(`/driver/my-jobs/${data.nextJob!.id}`)}
                className="flex-1 text-white font-bold text-sm py-3 rounded-xl transition-colors min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                View Details
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
            <p className="text-3xl mb-2">🏖️</p>
            <p className="font-bold text-white">No jobs scheduled today</p>
            <p className="text-sm text-white/55 mt-1">Check the Available Jobs board</p>
            <a href="/jobs" className="mt-4 inline-block text-black font-black text-sm px-6 py-2.5 rounded-xl transition-opacity" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
              Browse Jobs
            </a>
          </div>
        )}
      </div>
    </>
  );
}
