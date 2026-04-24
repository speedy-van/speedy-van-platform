"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface EarningsData {
  today: { jobs: number; amount: number };
  thisWeek: { jobs: number; amount: number };
  thisMonth: { jobs: number; amount: number };
  allTime: { jobs: number; amount: number };
  unpaid: { jobs: number; amount: number };
  recentPayments: { date: string; amount: number; jobCount: number }[];
  dailyCap: number;
  todayRemaining: number;
}

function StatCard({
  label,
  amount,
  jobs,
  accent,
}: {
  label: string;
  amount: number;
  jobs: number;
  accent?: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (amount === 0) return;
    let start = 0;
    const step = amount / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= amount) {
        setDisplayed(amount);
        clearInterval(id);
      } else {
        setDisplayed(Math.round(start));
      }
    }, 20);
    return () => clearInterval(id);
  }, [amount]);

  return (
    <div
      className={`rounded-xl p-4 flex flex-col gap-1 ${
        accent ? "bg-yellow-400" : "bg-slate-800"
      }`}
    >
      <span
        className={`font-mono text-2xl font-bold ${
          accent ? "text-slate-900" : "text-white"
        }`}
      >
        £{displayed.toFixed(0)}
      </span>
      <span
        className={`text-xs font-semibold ${
          accent ? "text-slate-800" : "text-slate-400"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-xs ${accent ? "text-slate-700" : "text-slate-500"}`}
      >
        {jobs} {jobs === 1 ? "job" : "jobs"}
      </span>
    </div>
  );
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<EarningsData>("/driver/earnings")
      .then((res) => res.data && setData(res.data))
      .catch(() => setError("Failed to load earnings"));
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-400 text-sm">{error}</div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          All time: £{data.allTime.amount.toFixed(2)} across {data.allTime.jobs} jobs
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Today" amount={data.today.amount} jobs={data.today.jobs} accent />
          <StatCard label="This Week" amount={data.thisWeek.amount} jobs={data.thisWeek.jobs} />
          <StatCard label="This Month" amount={data.thisMonth.amount} jobs={data.thisMonth.jobs} />
        </div>

        {/* Daily cap */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Daily cap</span>
            <span className="text-sm text-slate-400">
              £{data.today.amount.toFixed(0)} / £{data.dailyCap}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (data.today.amount / data.dailyCap) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            £{data.todayRemaining.toFixed(2)} remaining today
          </p>
        </div>

        {/* Unpaid */}
        {data.unpaid.jobs > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-orange-400">Unpaid earnings</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {data.unpaid.jobs} {data.unpaid.jobs === 1 ? "job" : "jobs"} pending payment
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-orange-400">
              £{data.unpaid.amount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Recent payments */}
        {data.recentPayments.length > 0 && (
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
              <h2 className="font-semibold text-sm">Recent payments</h2>
            </div>
            {data.recentPayments.map((p) => (
              <div
                key={p.date}
                className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{formatDay(p.date)}</p>
                  <p className="text-xs text-slate-500">
                    {p.jobCount} {p.jobCount === 1 ? "job" : "jobs"}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold text-emerald-400">
                  +£{p.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {data.recentPayments.length === 0 && data.allTime.jobs === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">💷</p>
            <p className="font-semibold">No earnings yet</p>
            <p className="text-sm mt-1">Complete jobs to see your earnings here</p>
          </div>
        )}
      </div>
    </div>
  );
}
