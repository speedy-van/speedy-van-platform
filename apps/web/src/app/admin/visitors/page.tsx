"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import KPICard from "@/components/admin/KPICard";

interface VisitorEvent { page?: string | null }
interface RealtimeVisitor {
  id: string;
  referrer?: string | null;
  landingPage?: string | null;
  pageViews: number;
  createdAt: string;
  lastActiveAt: string;
  events: VisitorEvent[];
}
interface RealtimeData { count: number; visitors: RealtimeVisitor[]; cappedAt?: number; timezone?: string }
interface TodayData { visitors: number; pageViews: number; timezone?: string }
interface WeekDayEntry { date: string; count: number }
interface WeekData { visitors: WeekDayEntry[] | number; timezone?: string }

function currentPage(visitor: RealtimeVisitor): string {
  return visitor.events.find((event) => Boolean(event.page))?.page ?? visitor.landingPage ?? "/";
}

export default function VisitorsPage() {
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [today, setToday] = useState<TodayData | null>(null);
  const [week, setWeek] = useState<WeekData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    const [rt, td, wk] = await Promise.allSettled([
      api.get<RealtimeData>("/admin/visitors/realtime"),
      api.get<TodayData>("/admin/visitors/today"),
      api.get<WeekData>("/admin/visitors/week"),
    ]);

    const errors: string[] = [];
    if (rt.status === "fulfilled" && rt.value.success && rt.value.data) setRealtime(rt.value.data);
    else errors.push(rt.status === "fulfilled" ? rt.value.error ?? "Realtime visitors failed." : "Realtime visitors failed.");

    if (td.status === "fulfilled" && td.value.success && td.value.data) setToday(td.value.data);
    else errors.push(td.status === "fulfilled" ? td.value.error ?? "Today visitors failed." : "Today visitors failed.");

    if (wk.status === "fulfilled" && wk.value.success && wk.value.data) setWeek(wk.value.data);
    else errors.push(wk.status === "fulfilled" ? wk.value.error ?? "Weekly visitors failed." : "Weekly visitors failed.");

    setError(errors[0] ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 15000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchAll]);

  const weekData: { date: string; count: number }[] = Array.isArray(week?.visitors) ? (week!.visitors as { date: string; count: number }[]) : [];
  const maxCount = weekData.length > 0 ? Math.max(...weekData.map((d) => d.count), 1) : 1;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {error ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error} Showing any last successful visitor data that is still available.
            </div>
          ) : null}

          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard title="Active Right Now" value={realtime?.count ?? 0} icon="🟢" subtitle="Real-time" />
            <KPICard title="Today's Visitors" value={today?.visitors ?? 0} icon="👤" />
            <KPICard title="Page Views Today" value={today?.pageViews ?? 0} icon="📄" />
          </div>

          {/* Weekly chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Visitors — Last 7 Days</h3>
            <div className="flex items-end gap-2 h-40">
              {weekData.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500 font-mono">{d.count}</span>
                  <div
                    className="w-full bg-amber-500 rounded-t-sm transition-all duration-700"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                  />
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
              {weekData.length === 0 && <p className="text-sm text-slate-400 self-center w-full text-center">No data yet</p>}
            </div>
          </div>

          {/* Live visitors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-700">Active Visitors ({realtime?.count ?? 0})</h3>
              <span className="text-xs text-slate-400 ml-auto">Auto-refreshes every 15s</span>
            </div>
            {(realtime?.visitors ?? []).length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">No active visitors right now</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {(realtime?.visitors ?? []).map((v) => (
                  <div key={v.id} className="px-5 py-3 flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{currentPage(v)}</p>
                      <p className="text-xs text-slate-400">
                        {`${v.pageViews} page view${v.pageViews === 1 ? "" : "s"}`}
                        {v.referrer && ` · from ${v.referrer}`}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {(() => {
                        const secs = Math.floor((Date.now() - new Date(v.createdAt).getTime()) / 1000);
                        if (secs < 60) return `${secs}s`;
                        return `${Math.floor(secs / 60)}m`;
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
