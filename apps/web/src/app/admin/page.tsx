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
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No bookings yet</td></tr>
              ) : bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{b.reference}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{b.customerName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{b.serviceName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(b.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-900 text-right">£{b.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/bookings/${b.id}`} className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors">
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
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/drivers" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
            + Add Driver
          </Link>
          <Link href="/admin/pricing" className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors">
            Adjust Pricing
          </Link>
          <Link href="/admin/jobs" className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors">
            View Job Board
          </Link>
        </div>
      </div>
    </div>
  );
}
