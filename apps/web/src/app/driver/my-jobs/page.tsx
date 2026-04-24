"use client";

import { useEffect, useState, useCallback } from "react";
import { DriverTopBar } from "@/components/driver/DriverTopBar";
import { JobCard, type DriverJobCard } from "@/components/driver/JobCard";
import { StatusButton } from "@/components/driver/StatusButton";
import { LocationToggle } from "@/components/driver/LocationToggle";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

type Tab = "upcoming" | "in_progress" | "completed" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "all", label: "All" },
];

export default function MyJobsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [jobs, setJobs] = useState<DriverJobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  const fetchJobs = useCallback(async (status: Tab) => {
    setLoading(true);
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setJobs(json.data?.jobs ?? json.data ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(tab); }, [tab, fetchJobs]);

  async function handleStatusUpdate(jobId: string, nextStatus: string) {
    setUpdating(jobId);
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Status updated!");
        await fetchJobs(tab);
      } else {
        showToast(json.error ?? "Update failed", false);
      }
    } catch {
      showToast("Network error", false);
    }
    setUpdating(null);
  }

  async function handleReject(jobId: string) {
    if (!confirm("Reject this job? It will be returned to the board.")) return;
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs/${jobId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        showToast("Job rejected");
        await fetchJobs(tab);
      } else {
        showToast(json.error ?? "Failed to reject", false);
      }
    } catch {
      showToast("Network error", false);
    }
  }

  const inProgressStatuses = new Set(["ACCEPTED", "DRIVER_EN_ROUTE", "ARRIVED_PICKUP", "LOADING", "IN_TRANSIT", "ARRIVED_DROPOFF", "UNLOADING"]);

  return (
    <>
      <DriverTopBar title="My Jobs" />
      {toast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Location toggle */}
        <div className="mb-4 flex justify-end">
          <LocationToggle />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === t.id ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Job list */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-bold text-slate-700">No {tab === "all" ? "" : tab.replace("_", " ")} jobs</p>
            <a href="/jobs" className="mt-4 inline-block text-blue-600 text-sm font-semibold">Browse available jobs →</a>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {jobs.map((job) => (
              <div key={job.id}>
                <JobCard job={job} compact={false} />
                {inProgressStatuses.has(job.status) && (
                  <div className="mt-2 space-y-2">
                    <StatusButton
                      currentStatus={job.status}
                      onUpdate={(s) => handleStatusUpdate(job.id, s)}
                      loading={updating === job.id}
                    />
                    {job.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleReject(job.id)}
                        className="w-full text-sm text-red-500 hover:text-red-700 py-2 font-medium"
                      >
                        Reject this job
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
