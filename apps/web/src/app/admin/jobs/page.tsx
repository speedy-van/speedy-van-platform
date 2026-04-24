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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="CLAIMED">Claimed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select value={filterPublic} onChange={(e) => setFilterPublic(e.target.value)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All visibility</option>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={pauseAll} disabled={saving === "all"} className="px-4 py-2 text-sm font-semibold border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 disabled:opacity-50">
            Pause All
          </button>
          <button onClick={publishAll} disabled={saving === "all"} className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            Publish All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-50">
                {jobs.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No jobs found</td></tr>
                ) : jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-semibold text-slate-900">{job.booking.reference}</p>
                      <p className="text-xs text-slate-500">{job.booking.customerName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{job.booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{new Date(job.booking.scheduledAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-right text-slate-900">£{job.booking.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-slate-400">£</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={editingPay[job.id] !== undefined ? editingPay[job.id] : (job.driverPay?.toFixed(2) ?? "")}
                          onChange={(e) => setEditingPay((p) => ({ ...p, [job.id]: e.target.value }))}
                          onBlur={() => { if (editingPay[job.id] !== undefined) saveDriverPay(job.id); }}
                          disabled={savingPay === job.id}
                          className="w-16 px-2 py-1 text-xs border border-slate-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 text-right"
                        />
                        {job.driverPayStatus === "paid" && <span className="text-xs text-emerald-600 font-bold">✓</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={job.driverId ?? ""}
                        onChange={(e) => assignDriver(job, e.target.value)}
                        disabled={saving === job.id}
                        className="text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="">Unassigned</option>
                        {drivers.map((d) => <option key={d.id} value={d.id}>{d.user.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePublic(job)} disabled={saving === job.id}
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${job.isPublic ? "bg-emerald-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${job.isPublic ? "translate-x-4" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/bookings/${job.booking.id}`} className="text-xs font-medium text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">View</Link>
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
