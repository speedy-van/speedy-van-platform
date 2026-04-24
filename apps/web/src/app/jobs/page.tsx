"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "@/lib/auth-client";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

interface Job {
  id: string;
  status: string;
  createdAt: string;
  driverPay?: number;
  booking: {
    id: string;
    reference: string;
    serviceName: string;
    serviceSlug: string;
    scheduledAt: string;
    selectedTimeSlot?: string;
    pickupPostcode: string;
    dropoffPostcode: string;
    distanceMiles?: number;
    totalPrice: number;
    helpersCount: number;
    needsPacking: boolean;
    needsAssembly: boolean;
  };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function timeUpdated(secs: number): string {
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

const SERVICE_ICONS: Record<string, string> = {
  "house-move": "🏠",
  "van-with-man": "🚛",
  "piano-move": "🎹",
  "office-move": "🏢",
  "delivery": "📦",
  "clearance": "🗑️",
};

const TIME_LABELS: Record<string, string> = {
  morning: "🌅 AM",
  afternoon: "☀️ PM",
  evening: "🌙 Eve",
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedSecs, setUpdatedSecs] = useState(0);
  const [filterService, setFilterService] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [sort, setSort] = useState("newest");
  const [confirmJob, setConfirmJob] = useState<Job | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const prevCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  function playSound() {
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 660;
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(); osc.stop(ctx.currentTime + 0.3);
        } catch {}
      });
    } catch {}
  }

  const fetchJobs = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterService) params.set("service", filterService);
    if (filterArea) params.set("area", filterArea);
    if (sort !== "newest") params.set("sort", sort === "highest" ? "highest" : "shortest");
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("sv-auth-token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/driver/jobs?${params}`, { headers });
      const data = await res.json();
      if (data.success) {
        const newJobs: Job[] = data.data?.jobs ?? [];
        const newCount = newJobs.length;
        if (newCount > prevCount.current && prevCount.current > 0) {
          playSound();
          showToast("🆕 New job available!");
        }
        prevCount.current = newCount;
        setJobs(newJobs);
      }
    } catch {}
    setUpdatedSecs(0);
    setLoading(false);
  }, [filterService, filterArea, sort]);

  useEffect(() => {
    fetchJobs();
    timerRef.current = setInterval(fetchJobs, 15000);
    secsRef.current = setInterval(() => setUpdatedSecs((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (secsRef.current) clearInterval(secsRef.current);
    };
  }, [fetchJobs]);

  function handleAcceptClick(job: Job) {
    if (!isAuthenticated()) {
      router.push(`/driver/login?returnUrl=/jobs`);
      return;
    }
    const user = getUser();
    if (user?.role !== "DRIVER") {
      showToast("This page is for registered drivers only", "error");
      return;
    }
    setConfirmJob(job);
  }

  async function confirmAccept() {
    if (!confirmJob) return;
    setAccepting(true);
    try {
      const token = sessionStorage.getItem("sv-auth-token");
      const res = await fetch(`${API_BASE}/driver/jobs/${confirmJob.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAcceptedIds((prev) => { const n = new Set<string>(); prev.forEach((v) => n.add(v)); n.add(confirmJob.id); return n; });
        setTimeout(() => {
          setJobs((j) => j.filter((x) => x.id !== confirmJob.id));
          prevCount.current = Math.max(prevCount.current - 1, 0);
        }, 500);
        setConfirmJob(null);
        showToast("Job accepted! View in My Jobs →");
      } else if (data.code === "JOB_TAKEN") {
        setConfirmJob(null);
        showToast("This job was just taken by another driver. Try another.", "error");
        await fetchJobs();
      } else {
        showToast(data.error ?? "Failed to accept job", "error");
        setConfirmJob(null);
      }
    } catch {
      showToast("Network error. Please try again.", "error");
      setConfirmJob(null);
    }
    setAccepting(false);
  }

  const services = jobs.map((j) => j.booking.serviceSlug).filter((s, i, a) => s && a.indexOf(s) === i) as string[];
  const areas = jobs.map((j) => j.booking.pickupPostcode?.split(" ")[0]).filter((s, i, a) => s && a.indexOf(s) === i) as string[];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">🚛 Available Jobs</h1>
            <p className="text-xs text-slate-400 mt-0.5">Updated {timeUpdated(updatedSecs)} · Auto-refresh</p>
          </div>
          <a href="/driver/login" className="bg-[#FACC15] hover:bg-yellow-500 text-slate-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors">
            Driver Login
          </a>
        </div>

        {/* Filters */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Services</option>
            {services.map((s) => <option key={s} value={s}>{s.replace(/-/g, " ")}</option>)}
          </select>
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Areas</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="highest">Highest Pay</option>
            <option value="shortest">Shortest Distance</option>
          </select>
        </div>
      </header>

      {/* Job list */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-lg font-bold text-slate-800">No jobs available right now</p>
            <p className="text-sm text-slate-500 mt-2">New jobs appear automatically when customers book. Check back soon or enable notifications in the driver app.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const isAccepted = acceptedIds.has(job.id);
            const icon = SERVICE_ICONS[job.booking.serviceSlug] ?? "📦";
            const pay = job.driverPay ?? 0;
            const dateStr = new Date(job.booking.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", weekday: "short" });
            const slot = job.booking.selectedTimeSlot ? TIME_LABELS[job.booking.selectedTimeSlot] ?? job.booking.selectedTimeSlot : "";
            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all duration-500 ${isAccepted ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="font-bold text-slate-900 text-base leading-tight">{job.booking.serviceName}</p>
                        <p className="text-xs font-mono text-slate-400">{job.booking.reference}</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(job.createdAt)}</span>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                  <p>📍 <span className="font-semibold">{job.booking.pickupPostcode}</span> → <span className="font-semibold">{job.booking.dropoffPostcode}</span></p>
                  <div className="flex flex-wrap gap-3 text-slate-600">
                    {job.booking.distanceMiles ? <span>📏 {job.booking.distanceMiles.toFixed(0)} mi</span> : null}
                    <span>📅 {dateStr}</span>
                    {slot && <span>{slot}</span>}
                    {job.booking.helpersCount > 0 && <span>👥 {job.booking.helpersCount} helper{job.booking.helpersCount > 1 ? "s" : ""}</span>}
                    {job.booking.needsPacking && <span>📦 Packing</span>}
                    {job.booking.needsAssembly && <span>🔧 Assembly</span>}
                  </div>
                  <p className="text-emerald-600 font-extrabold text-lg font-mono mt-2">💷 Driver pay: £{pay.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => handleAcceptClick(job)}
                  className="mt-4 w-full bg-[#FACC15] hover:bg-yellow-500 text-slate-900 font-bold text-base py-3 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2"
                >
                  Accept Job ✅
                </button>
              </div>
            );
          })
        )}
      </main>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-slate-500 mb-3">Want to drive with us?</p>
        <a
          href="https://apps.apple.com/gb/app/speedy-van-driver/id6753916830"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          🍎 Download iOS Driver App
        </a>
      </div>

      {/* Accept Confirmation Modal */}
      {confirmJob && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Accept this job?</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 text-sm">
              <p className="font-semibold text-slate-800">{confirmJob.booking.serviceName}</p>
              <p className="text-slate-600">📍 {confirmJob.booking.pickupPostcode} → {confirmJob.booking.dropoffPostcode}</p>
              <p className="text-slate-600">📅 {new Date(confirmJob.booking.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
              <p className="text-emerald-600 font-extrabold text-xl font-mono mt-2">💷 £{(confirmJob.driverPay ?? 0).toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmJob(null)} className="flex-1 py-3 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 min-h-[48px]">
                Cancel
              </button>
              <button onClick={confirmAccept} disabled={accepting} className="flex-1 py-3 text-sm font-bold bg-[#FACC15] hover:bg-yellow-500 text-slate-900 rounded-xl disabled:opacity-50 min-h-[48px]">
                {accepting ? "Accepting…" : "Yes, Accept!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
