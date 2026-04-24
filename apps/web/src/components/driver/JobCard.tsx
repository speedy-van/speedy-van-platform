"use client";

import Link from "next/link";

export interface DriverJobCard {
  id: string;
  status: string;
  driverPay?: number;
  driverPayStatus?: string;
  booking: {
    id: string;
    reference: string;
    serviceName: string;
    scheduledAt: string;
    selectedTimeSlot?: string;
    pickupAddress?: string;
    dropoffAddress?: string;
    pickupPostcode: string;
    dropoffPostcode: string;
    distanceMiles?: number;
    helpersCount: number;
    needsPacking: boolean;
    needsAssembly: boolean;
    customerName?: string;
    customerPhone?: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  ACCEPTED: "bg-blue-100 text-blue-700",
  DRIVER_EN_ROUTE: "bg-indigo-100 text-indigo-700",
  ARRIVED_PICKUP: "bg-orange-100 text-orange-700",
  LOADING: "bg-amber-100 text-amber-700",
  IN_TRANSIT: "bg-purple-100 text-purple-700",
  ARRIVED_DROPOFF: "bg-pink-100 text-pink-700",
  UNLOADING: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  AVAILABLE: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-600",
};

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

const TIME_LABELS: Record<string, string> = {
  morning: "🌅 Morning",
  afternoon: "☀️ Afternoon",
  evening: "🌙 Evening",
};

export function JobCard({ job, compact = false }: { job: DriverJobCard; compact?: boolean }) {
  const pay = job.driverPay ?? 0;
  const dateStr = new Date(job.booking.scheduledAt).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
  const slot = job.booking.selectedTimeSlot ? TIME_LABELS[job.booking.selectedTimeSlot] ?? job.booking.selectedTimeSlot : null;
  const maps = (addr: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-bold text-slate-900 text-base leading-tight">{job.booking.serviceName}</p>
          <p className="text-xs font-mono text-slate-400">{job.booking.reference}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-slate-100 text-slate-600"}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
          {job.driverPayStatus === "paid" && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">PAID</span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 text-sm text-slate-700 mb-3">
        <div className="flex flex-wrap gap-3">
          <span>📅 {dateStr}</span>
          {slot && <span>{slot}</span>}
          {job.booking.distanceMiles ? <span>📏 {job.booking.distanceMiles.toFixed(0)} mi</span> : null}
        </div>

        {/* Pickup address */}
        <a
          href={maps(job.booking.pickupAddress ?? job.booking.pickupPostcode)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-blue-600 hover:text-blue-800 break-all"
        >
          <span className="flex-shrink-0 mt-0.5">🟢</span>
          <span>{compact ? job.booking.pickupPostcode : (job.booking.pickupAddress ?? job.booking.pickupPostcode)}</span>
        </a>

        {/* Drop-off address */}
        <a
          href={maps(job.booking.dropoffAddress ?? job.booking.dropoffPostcode)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-blue-600 hover:text-blue-800 break-all"
        >
          <span className="flex-shrink-0 mt-0.5">🔴</span>
          <span>{compact ? job.booking.dropoffPostcode : (job.booking.dropoffAddress ?? job.booking.dropoffPostcode)}</span>
        </a>

        {/* Extras */}
        <div className="flex flex-wrap gap-2 text-slate-500">
          {job.booking.helpersCount > 0 && <span>👥 {job.booking.helpersCount} helper{job.booking.helpersCount > 1 ? "s" : ""}</span>}
          {job.booking.needsPacking && <span>📦 Packing</span>}
          {job.booking.needsAssembly && <span>🔧 Assembly</span>}
        </div>

        {/* Customer phone if available */}
        {job.booking.customerPhone && (
          <a href={`tel:${job.booking.customerPhone}`} className="flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800">
            📞 {job.booking.customerPhone}
          </a>
        )}
      </div>

      {/* Pay + View link */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-emerald-600 font-extrabold text-xl font-mono">£{pay.toFixed(2)}</span>
        <Link href={`/driver/my-jobs/${job.id}`} className="text-sm text-blue-600 font-semibold hover:underline">
          View Details →
        </Link>
      </div>
    </div>
  );
}
