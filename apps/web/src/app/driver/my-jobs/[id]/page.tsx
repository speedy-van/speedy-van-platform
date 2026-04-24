"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DriverTopBar } from "@/components/driver/DriverTopBar";
import { StatusButton } from "@/components/driver/StatusButton";
import { LocationToggle } from "@/components/driver/LocationToggle";
import { ChatWindow } from "@/components/chat/ChatWindow";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

const STATUS_LABELS: Record<string, string> = {
  ACCEPTED: "Accepted",
  DRIVER_EN_ROUTE: "En Route",
  ARRIVED_PICKUP: "At Pickup",
  LOADING: "Loading",
  IN_TRANSIT: "In Transit",
  ARRIVED_DROPOFF: "At Drop-off",
  UNLOADING: "Unloading",
  COMPLETED: "Completed",
  AVAILABLE: "Available",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  ACCEPTED: "bg-blue-100 text-blue-700",
  DRIVER_EN_ROUTE: "bg-indigo-100 text-indigo-700",
  ARRIVED_PICKUP: "bg-orange-100 text-orange-700",
  LOADING: "bg-amber-100 text-amber-700",
  IN_TRANSIT: "bg-purple-100 text-purple-700",
  ARRIVED_DROPOFF: "bg-pink-100 text-pink-700",
  UNLOADING: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const TIME_LABELS: Record<string, string> = {
  morning: "🌅 Morning",
  afternoon: "☀️ Afternoon",
  evening: "🌙 Evening",
};

interface JobDetail {
  id: string;
  status: string;
  driverPay?: number;
  driverPayStatus?: string;
  proofImageUrl?: string;
  booking: {
    id: string;
    reference: string;
    serviceName: string;
    scheduledAt: string;
    selectedTimeSlot?: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupPostcode: string;
    dropoffPostcode: string;
    distanceMiles?: number;
    helpersCount: number;
    needsPacking: boolean;
    needsAssembly: boolean;
    items?: { name: string; quantity: number; isFragile?: boolean }[];
    notes?: string;
    customer?: { name: string; phone?: string };
    conversation?: { id: string } | null;
  };
}

export default function MyJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchJob() {
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs?status=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        const jobs: JobDetail[] = json.data?.jobs ?? json.data ?? [];
        const found = jobs.find((j) => j.id === id) ?? null;
        setJob(found);
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchJob(); }, [id]);

  async function handleStatusUpdate(nextStatus: string) {
    setUpdating(true);
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Status updated!");
        await fetchJob();
      } else {
        showToast(json.error ?? "Update failed", false);
      }
    } catch {
      showToast("Network error", false);
    }
    setUpdating(false);
  }

  async function handleProofSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!proofUrl.trim()) return;
    setUploadingProof(true);
    const token = sessionStorage.getItem("sv-auth-token");
    try {
      const res = await fetch(`${API_BASE}/driver/my-jobs/${id}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl: proofUrl.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Photo saved!");
        setProofUrl("");
        await fetchJob();
      } else {
        showToast(json.error ?? "Failed to save photo", false);
      }
    } catch {
      showToast("Network error", false);
    }
    setUploadingProof(false);
  }

  const inProgressStatuses = new Set(["ACCEPTED", "DRIVER_EN_ROUTE", "ARRIVED_PICKUP", "LOADING", "IN_TRANSIT", "ARRIVED_DROPOFF", "UNLOADING"]);
  const maps = (addr: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;

  if (loading) return (
    <>
      <DriverTopBar title="Job Details" />
      <div className="flex justify-center py-20"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
    </>
  );

  if (!job) return (
    <>
      <DriverTopBar title="Job Details" />
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">❌</p>
        <p className="font-bold text-slate-700">Job not found</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 text-sm font-semibold">← Go back</button>
      </div>
    </>
  );

  return (
    <>
      <DriverTopBar title="Job Details" />
      {toast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-8">
        {/* Status + location */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[job.status] ?? "bg-slate-100 text-slate-600"}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
          <LocationToggle />
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div>
            <p className="font-extrabold text-slate-900 text-lg">{job.booking.serviceName}</p>
            <p className="text-xs font-mono text-slate-400">{job.booking.reference}</p>
          </div>
          <div className="text-sm text-slate-700 space-y-1.5">
            <p>📅 {new Date(job.booking.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {job.booking.selectedTimeSlot && ` · ${TIME_LABELS[job.booking.selectedTimeSlot] ?? job.booking.selectedTimeSlot}`}
            </p>
            {job.booking.distanceMiles ? <p>📏 {job.booking.distanceMiles.toFixed(1)} miles</p> : null}
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Route</p>
          <a href={maps(job.booking.pickupAddress)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-blue-600 hover:text-blue-800 text-sm">
            <span className="flex-shrink-0 mt-0.5">🟢</span>
            <span>{job.booking.pickupAddress}</span>
          </a>
          <a href={maps(job.booking.dropoffAddress)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-blue-600 hover:text-blue-800 text-sm">
            <span className="flex-shrink-0 mt-0.5">🔴</span>
            <span>{job.booking.dropoffAddress}</span>
          </a>
        </div>

        {/* Items */}
        {job.booking.items && job.booking.items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Items</p>
            <div className="grid grid-cols-2 gap-2">
              {job.booking.items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl px-3 py-2 text-sm">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-slate-500 ml-1">× {item.quantity}</span>
                  {item.isFragile && <span className="ml-1.5 text-xs text-amber-600 font-bold">🔸 Fragile</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {job.booking.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">📝 Notes from customer</p>
            <p className="text-sm text-amber-900">{job.booking.notes}</p>
          </div>
        )}

        {/* Customer contact */}
        {job.booking.customer?.phone && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Customer</p>
            <a href={`tel:${job.booking.customer.phone}`} className="flex items-center gap-2 text-emerald-600 font-bold text-base hover:text-emerald-800">
              📞 {job.booking.customer.phone}
            </a>
          </div>
        )}

        {/* Pay */}
        <div className="bg-[#0F172A] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Your earnings</p>
            <p className="text-3xl font-extrabold font-mono text-yellow-400 mt-1">£{(job.driverPay ?? 0).toFixed(2)}</p>
          </div>
          {job.driverPayStatus === "paid" ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">PAID</span>
          ) : (
            <span className="bg-slate-600 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">Pending</span>
          )}
        </div>

        {/* Proof image */}
        {job.proofImageUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Proof of Delivery</p>
            <img src={job.proofImageUrl} alt="Proof of delivery" className="w-full rounded-xl object-cover max-h-60" />
          </div>
        )}

        {/* Status button */}
        {inProgressStatuses.has(job.status) && (
          <StatusButton
            currentStatus={job.status}
            onUpdate={handleStatusUpdate}
            loading={updating}
          />
        )}

        {/* Upload proof (only when completed without proof) */}
        {job.status === "COMPLETED" && !job.proofImageUrl && (
          <form onSubmit={handleProofSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <p className="text-sm font-bold text-slate-700">Upload Proof of Delivery</p>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="Paste image URL"
              required
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={uploadingProof} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50 min-h-[48px]">
              {uploadingProof ? "Saving…" : "Save Photo"}
            </button>
          </form>
        )}

        {/* Chat with customer/admin */}
        {job.booking.conversation?.id && (
          <ChatWindow
            mode="authed"
            conversationId={job.booking.conversation.id}
            currentUserId={typeof window !== "undefined" ? (JSON.parse(sessionStorage.getItem("sv-user") ?? "{}") as { id?: string }).id ?? "" : ""}
            token={typeof window !== "undefined" ? sessionStorage.getItem("sv-auth-token") ?? "" : ""}
            title="Chat with Admin / Customer"
          />
        )}
      </div>
    </>
  );
}
