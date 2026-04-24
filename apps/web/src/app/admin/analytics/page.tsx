"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface DayCount { day: string; count: number }
interface DayRevenue { day: string; revenue: number }
interface ServiceStat { slug: string; name: string; count: number; revenue: number }
interface AreaStat { area: string; count: number }
interface DriverStat { id: string; name: string; completedJobs: number }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const fmtDay = (s: unknown) => {
  if (!s) return "";
  const d = new Date(String(s));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

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
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const noData = (arr: unknown[]) => arr.length === 0;

  return (
    <div className="space-y-6">
      {/* Bookings per day */}
      <ChartCard title="Bookings per Day">
        {noData(bookingsPerDay) ? <Empty /> : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(v) => fmtDay(v)} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="Bookings" />
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
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
              <Tooltip labelFormatter={(v) => fmtDay(v)} formatter={(v: unknown) => [`£${Number(v).toFixed(2)}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Top areas */}
        <ChartCard title="Top Areas">
          {noData(areas) ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={areas.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="area" type="category" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Bookings" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completedJobs" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Completed Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400 text-center py-12">No data yet</p>;
}
