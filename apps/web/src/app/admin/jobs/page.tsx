"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";

interface Job {
  id: string;
  status: string;
  isPublic: boolean;
  driverId?: string;
  driverPay?: number;
  driverPayStatus?: string;
  driver?: { user: { name: string } };
  booking: {
    id: string;
    reference: string;
    customerName: string;
    serviceName: string;
    scheduledAt: string;
    totalPrice: number;
    pickupAddress: string;
    dropoffAddress?: string;
  };
}

interface Driver { id: string; user: { name: string }; vanSize: string }

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };
const selectCls = "px-3 py-2 text-sm border border-amber-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white bg-white/5";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPublic, setFilterPublic] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [editingPay, setEditingPay] = useState<Record<string, string>>({});
  const [savingPay, setSavingPay] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterPublic !== "") params.set("isPublic", filterPublic);
    const [jobsRes, driversRes] = await Promise.all([
      api.get<{ jobs: Job[] }>(`/admin/jobs?${params}`),
      api.get<{ drivers: Driver[] }>("/admin/drivers"),
    ]);
    if (jobsRes.success && jobsRes.data) setJobs(jobsRes.data.jobs ?? []);
    if (driversRes.success && driversRes.data) setDrivers(driversRes.data.drivers ?? []);
    setLoading(false);
  }, [filterStatus, filterPublic]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function togglePublic(job: Job) {
    setSaving(job.id);
    await api.patch(`/admin/jobs/${job.id}`, { isPublic: !job.isPublic });
    setJobs((j) => j.map((x) => x.id === job.id ? { ...x, isPublic: !x.isPublic } : x));
    setSaving(null);
  }

  async function assignDriver(job: Job, driverId: string) {
    setSaving(job.id);
    await api.patch(`/admin/jobs/${job.id}`, { driverId });
    const driver = drivers.find((d) => d.id === driverId);
    setJobs((j) => j.map((x) => x.id === job.id ? { ...x, driverId, driver } : x));
    setSaving(null);
  }

  async function publishAll() {
    setSaving("all");
    await api.post("/admin/jobs/resume-all", {});
    await fetchJobs();
    setSaving(null);
  }

  async function pauseAll() {
    setSaving("all");
    await api.post("/admin/jobs/pause-all", {});
    await fetchJobs();
    setSaving(null);
  }

  async function saveDriverPay(jobId: string) {
    const val = editingPay[jobId];
    if (!val) return;
    setSavingPay(jobId);
    await api.patch(`/admin/jobs/${jobId}/driver-pay`, { driverPay: parseFloat(val) });
    setJobs((j) => j.map((x) => x.id === jobId ? { ...x, driverPay: parseFloat(val) } : x));
    setSavingPay(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls} style={{ background: "rgba(255,255,255,0.05)" }}>
            <option value="" style={{ background: "#1a1a1a" }}>All statuses</option>
            <option value="AVAILABLE" style={{ background: "#1a1a1a" }}>Available</option>
            <option value="CLAIMED" style={{ background: "#1a1a1a" }}>Claimed</option>
            <option value="ACCEPTED" style={{ background: "#1a1a1a" }}>Accepted</option>
            <option value="COMPLETED" style={{ background: "#1a1a1a" }}>Completed</option>
          </select>
          <select value={filterPublic} onChange={(e) => setFilterPublic(e.target.value)} className={selectCls} style={{ background: "rgba(255,255,255,0.05)" }}>
            <option value="" style={{ background: "#1a1a1a" }}>All visibility</option>
            <option value="true" style={{ background: "#1a1a1a" }}>Public</option>
            <option value="false" style={{ background: "#1a1a1a" }}>Private</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={pauseAll} disabled={saving === "all"} className="px-4 py-2 text-sm font-semibold border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/10 disabled:opacity-50">
            Pause All
          </button>
          <button onClick={publishAll} disabled={saving === "all"} className="px-4 py-2 text-sm font-black text-black rounded-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
            Publish All
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/8">
              <thead className="bg-white/3">
                <tr className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Booking</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">Driver Pay</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Public</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {jobs.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-white/40">No jobs found</td></tr>
                ) : jobs.map((job, idx) => (
                  <tr key={job.id} className="hover:bg-amber-500/6 transition-colors" style={{ background: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-semibold text-white">{job.booking.reference}</p>
                      <p className="text-xs text-white/40">{job.booking.customerName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/55">{job.booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-white/55">{new Date(job.booking.scheduledAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-right text-amber-400">£{job.booking.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-white/40">£</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={editingPay[job.id] !== undefined ? editingPay[job.id] : (job.driverPay?.toFixed(2) ?? "")}
                          onChange={(e) => setEditingPay((p) => ({ ...p, [job.id]: e.target.value }))}
                          onBlur={() => { if (editingPay[job.id] !== undefined) saveDriverPay(job.id); }}
                          disabled={savingPay === job.id}
                          className="w-16 px-2 py-1 text-xs border border-amber-900/20 rounded font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-50 text-right text-white bg-white/5"
                        />
                        {job.driverPayStatus === "paid" && <span className="text-xs text-emerald-400 font-bold">✓</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={job.driverId ?? ""}
                        onChange={(e) => assignDriver(job, e.target.value)}
                        disabled={saving === job.id}
                        className="text-xs px-2 py-1 border border-amber-900/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-50 text-white bg-white/5"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <option value="" style={{ background: "#1a1a1a" }}>Unassigned</option>
                        {drivers.map((d) => <option key={d.id} value={d.id} style={{ background: "#1a1a1a" }}>{d.user.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePublic(job)} disabled={saving === job.id}
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${job.isPublic ? "bg-emerald-500" : "bg-white/20"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${job.isPublic ? "translate-x-4" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/bookings/${job.booking.id}`} className="text-xs font-medium text-amber-400 border border-amber-900/30 rounded px-2 py-1 hover:bg-amber-500/10">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
