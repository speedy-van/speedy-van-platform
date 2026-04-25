"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";

interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  scheduledAt: string;
  selectedTimeSlot?: string;
  status: string;
  totalPrice: number;
  driver?: { user: { name: string } };
}

const STATUSES = ["", "PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await api.get<Booking[]>(`/admin/bookings?${params}`);
    if (res.success && res.data != null) {
      setBookings(Array.isArray(res.data) ? res.data : []);
      setTotal(res.pagination?.total ?? 0);
    } else if (!res.success) {
      setError(res.error ?? "Failed to load bookings");
    }
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="font-semibold">Error:</span> {error}
          <button onClick={fetch} className="ml-auto text-xs font-medium underline hover:no-underline">Retry</button>
        </div>
      )}
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search name, email, reference…"
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Date / Slot</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No bookings found</td></tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-900">{b.reference}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{b.customerName}</p>
                      <p className="text-xs text-slate-500">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{b.serviceName}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{new Date(b.scheduledAt).toLocaleDateString("en-GB")}</p>
                      {b.selectedTimeSlot && <p className="text-xs text-slate-500">{b.selectedTimeSlot}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{b.driver?.user.name ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-right text-slate-900">£{b.totalPrice.toFixed(2)}</td>
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
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{total} total</span>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Prev</button>
          <span className="font-medium">{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
