"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DayCount { day: string; count: number }
interface DayRevenue { day: string; revenue: number }
interface ServiceStat { slug: string; name: string; count: number; revenue: number }
interface AreaStat { area: string; count: number }
interface DriverStat { id: string; name: string; completedJobs: number }

const COLORS = ["#F59E0B", "#10b981", "#EA580C", "#ef4444", "#8b5cf6", "#ec4899"];

const fmtDay = (s: unknown) => {
  if (!s) return "";
  const d = new Date(String(s));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const chartStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

export default function AnalyticsPage() {
  const [bookingsPerDay, setBookingsPerDay] = useState<DayCount[]>([]);
  const [revenuePerDay, setRevenuePerDay] = useState<DayRevenue[]>([]);
  const [services, setServices] = useState<ServiceStat[]>([]);
  const [areas, setAreas] = useState<AreaStat[]>([]);
  const [driverStats, setDriverStats] = useState<DriverStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DayCount[]>("/admin/analytics/bookings-per-day"),
      api.get<DayRevenue[]>("/admin/analytics/revenue-per-day"),
      api.get<ServiceStat[]>("/admin/analytics/services"),
      api.get<AreaStat[]>("/admin/analytics/areas"),
      api.get<DriverStat[]>("/admin/analytics/drivers"),
    ]).then(([bpd, rpd, svc, ar, dri]) => {
      if (bpd.success && bpd.data) setBookingsPerDay(bpd.data);
      if (rpd.success && rpd.data) setRevenuePerDay(rpd.data);
      if (svc.success && svc.data) setServices(svc.data);
      if (ar.success && ar.data) setAreas(ar.data);
      if (dri.success && dri.data) setDriverStats(dri.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const noData = (arr: unknown[]) => arr.length === 0;

  return (
    <div className="space-y-6">
      {/* Bookings per day */}
      <ChartCard title="Bookings per Day">
        {noData(bookingsPerDay) ? <Empty /> : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
              <Tooltip
                contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", color: "#fff" }}
                labelFormatter={(v) => fmtDay(v)}
              />
              <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2} dot={false} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Revenue per day */}
      <ChartCard title="Revenue per Day (£)">
        {noData(revenuePerDay) ? <Empty /> : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenuePerDay}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} tickFormatter={(v) => `£${v}`} />
              <Tooltip
                contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", color: "#fff" }}
                labelFormatter={(v) => fmtDay(v)}
                formatter={(v: unknown) => [`£${Number(v).toFixed(2)}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services pie */}
        <ChartCard title="Bookings by Service">
          {noData(services) ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={services} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {services.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Top areas */}
        <ChartCard title="Top Areas">
          {noData(areas) ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={areas.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
                <YAxis dataKey="area" type="category" width={90} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="count" fill="#EA580C" radius={[0, 4, 4, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Driver performance */}
      {!noData(driverStats) && (
        <ChartCard title="Driver Performance (Completed Jobs)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={driverStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
              <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="completedJobs" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Completed Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-white/40 text-center py-12">No data yet</p>;
}
