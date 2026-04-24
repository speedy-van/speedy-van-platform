"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface StatsData {
  acceptanceRate: number;
  completionRate: number;
  onTimeRate: number;
  avgRating: number;
  totalReviews: number;
  rank: number;
  totalDrivers: number;
  achievements: { id: string; title: string; description: string; earned: boolean }[];
}

interface LeaderboardDriver {
  rank: number;
  name: string;
  completedJobs: number;
  earnings: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  period: string;
  drivers: LeaderboardDriver[];
}

function ProgressBar({ value, label, color = "bg-emerald-400" }: { value: number; label: string; color?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "text-yellow-400" : "text-slate-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<StatsData>("/driver/stats"),
      api.get<LeaderboardData>("/driver/leaderboard"),
    ])
      .then(([s, l]) => {
        if (s.data) setStats(s.data);
        if (l.data) setLeaderboard(l.data);
      })
      .catch(() => setError("Failed to load stats"));
  }, []);

  if (error) {
    return <div className="p-6 text-red-400 text-sm">{error}</div>;
  }

  if (!stats || !leaderboard) {
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
        <h1 className="text-2xl font-bold">Performance</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Ranked #{stats.rank} of {stats.totalDrivers} drivers
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Metrics */}
        <div className="bg-slate-800 rounded-xl p-4 space-y-4">
          <ProgressBar value={stats.acceptanceRate} label="Acceptance Rate" />
          <ProgressBar value={stats.completionRate} label="Completion Rate" />
          <ProgressBar value={stats.onTimeRate} label="On-Time Rate" />
        </div>

        {/* Rating */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Customer Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-3xl font-bold text-yellow-400">
                  {stats.avgRating.toFixed(1)}
                </span>
                <Stars rating={stats.avgRating} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                from {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-200">#{stats.rank}</p>
              <p className="text-xs text-slate-500">Rank</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h2 className="font-semibold text-sm">Achievements</h2>
          </div>
          {stats.achievements.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 last:border-0"
            >
              <span className={`text-xl ${a.earned ? "" : "opacity-30 grayscale"}`}>
                {a.id === "first_job" ? "🚚" : a.id === "ten_jobs" ? "⭐" : a.id === "fifty_jobs" ? "🏆" : "⭐"}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${a.earned ? "text-white" : "text-slate-500"}`}>
                  {a.title}
                </p>
                <p className="text-xs text-slate-500">{a.description}</p>
              </div>
              {a.earned && (
                <span className="text-xs text-emerald-400 font-semibold">Earned</span>
              )}
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
            <span>🏆</span>
            <h2 className="font-semibold text-sm">Leaderboard — This Month</h2>
          </div>
          {leaderboard.drivers.map((d) => (
            <div
              key={`${d.rank}-${d.name}`}
              className={`flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 last:border-0 ${
                d.isCurrentUser ? "bg-yellow-400/10" : ""
              }`}
            >
              <span
                className={`w-7 text-center font-mono font-bold text-sm ${
                  d.rank === 1 ? "text-yellow-400" : d.rank === 2 ? "text-slate-300" : d.rank === 3 ? "text-amber-600" : "text-slate-500"
                }`}
              >
                {d.rank}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    d.isCurrentUser ? "text-yellow-400" : "text-white"
                  }`}
                >
                  {d.name}
                  {d.isCurrentUser && (
                    <span className="ml-2 text-xs text-slate-400 font-normal">← You</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{d.completedJobs} jobs</p>
              </div>
              <span className="font-mono text-sm text-emerald-400 font-semibold">
                £{d.earnings.toFixed(0)}
              </span>
            </div>
          ))}
          {leaderboard.drivers.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No data for this month yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
