"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import KPICard from "@/components/admin/KPICard";
import StatusBadge from "@/components/admin/StatusBadge";

interface Overview {
  bookings: { total: number; today: number; month: number };
  revenue: { total: number; today: number; month: number };
  drivers: { active: number };
  jobs: { pending: number; completed: number };
  visitors: { active: number };
}

interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  scheduledAt: string;
  status: string;
  totalPrice: number;
  driver?: { user: { name: string } };
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Overview>("/admin/analytics/overview"),
      api.get<Booking[]>("/admin/bookings?limit=10"),
    ]).then(([ov, bk]) => {
      if (ov.success && ov.data) setOverview(ov.data);
      if (bk.success && bk.data) setBookings(bk.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Bookings" value={overview?.bookings.total ?? 0} icon="📦" subtitle={`${overview?.bookings.today ?? 0} today`} />
        <KPICard title="Revenue This Month" value={overview?.revenue.month ?? 0} icon="💷" prefix="£" decimals={2} subtitle={`£${(overview?.revenue.today ?? 0).toFixed(2)} today`} />
        <KPICard title="Active Drivers" value={overview?.drivers.active ?? 0} icon="🚛" />
        <KPICard title="Pending Jobs" value={overview?.jobs.pending ?? 0} icon="⏳" />
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20">
          <h2 className="text-base font-black text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-amber-400 hover:text-amber-300 font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8">
            <thead>
              <tr className="bg-white/3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-white/40">No bookings yet</td></tr>
              ) : bookings.map((b, idx) => (
                <tr key={b.id} className="hover:bg-amber-500/6 transition-colors" style={{ background: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td className="px-4 py-3 text-sm font-mono font-medium text-white">{b.reference}</td>
                  <td className="px-4 py-3 text-sm text-white/55">{b.customerName}</td>
                  <td className="px-4 py-3 text-sm text-white/55">{b.serviceName}</td>
                  <td className="px-4 py-3 text-sm text-white/55">
                    {new Date(b.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-white text-right">£{b.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/bookings/${b.id}`} className="text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-900/30 rounded px-2 py-1 hover:bg-amber-500/10 transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/drivers" className="text-black font-black text-sm px-5 py-2.5 rounded-lg transition-colors" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
            + Add Driver
          </Link>
          <Link href="/admin/pricing" className="font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors text-white/55 hover:text-white hover:bg-white/5 border border-amber-900/20">
            Adjust Pricing
          </Link>
          <Link href="/admin/jobs" className="font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors text-white/55 hover:text-white hover:bg-white/5 border border-amber-900/20">
            View Job Board
          </Link>
        </div>
      </div>
    </div>
  );
}
