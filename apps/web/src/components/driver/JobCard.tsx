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
    assemblyType?: string | null;
    assemblyQty?: number | null;
    customerName?: string;
    customerPhone?: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  ACCEPTED: "bg-amber-500/15 text-amber-400",
  DRIVER_EN_ROUTE: "bg-amber-500/15 text-amber-400",
  ARRIVED_PICKUP: "bg-amber-500/15 text-amber-400",
  LOADING: "bg-amber-500/15 text-amber-400",
  IN_TRANSIT: "bg-amber-500/15 text-amber-400",
  ARRIVED_DROPOFF: "bg-amber-500/15 text-amber-400",
  UNLOADING: "bg-amber-500/15 text-amber-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  AVAILABLE: "bg-white/10 text-white/60",
  CANCELLED: "bg-red-500/15 text-red-400",
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
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-bold text-white text-base leading-tight">{job.booking.serviceName}</p>
          <p className="text-xs font-mono text-white/40">{job.booking.reference}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-white/10 text-white/60"}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
          {job.driverPayStatus === "paid" && (
            <span className="text-xs bg-emerald-500/15 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">PAID</span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 text-sm text-white/55 mb-3">
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
          className="flex items-start gap-1.5 text-amber-400 hover:text-amber-300 break-all"
        >
          <span className="flex-shrink-0 mt-0.5">🟢</span>
          <span>{compact ? job.booking.pickupPostcode : (job.booking.pickupAddress ?? job.booking.pickupPostcode)}</span>
        </a>

        {/* Drop-off address */}
        <a
          href={maps(job.booking.dropoffAddress ?? job.booking.dropoffPostcode)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-amber-400 hover:text-amber-300 break-all"
        >
          <span className="flex-shrink-0 mt-0.5">🔴</span>
          <span>{compact ? job.booking.dropoffPostcode : (job.booking.dropoffAddress ?? job.booking.dropoffPostcode)}</span>
        </a>

        {/* Extras */}
        <div className="flex flex-wrap gap-2 text-white/40">
          {job.booking.helpersCount > 0 && <span>👥 {job.booking.helpersCount} helper{job.booking.helpersCount > 1 ? "s" : ""}</span>}
          {job.booking.needsPacking && <span>📦 Packing</span>}
          {job.booking.needsAssembly && (
            <span>🔧 {job.booking.assemblyType === "dismantle" ? "Dismantling" : job.booking.assemblyType === "assemble" ? "Assembly" : job.booking.assemblyType === "both" ? "Dismantle+Assemble" : "Assembly"}{job.booking.assemblyQty && job.booking.assemblyQty > 1 ? ` ×${job.booking.assemblyQty}` : ""}</span>
          )}
        </div>

        {/* Customer phone if available */}
        {job.booking.customerPhone && (
          <a href={`tel:${job.booking.customerPhone}`} className="flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300">
            📞 {job.booking.customerPhone}
          </a>
        )}
      </div>

      {/* Pay + View link */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-emerald-400 font-extrabold text-xl font-mono">£{pay.toFixed(2)}</span>
        <Link href={`/driver/my-jobs/${job.id}`} className="text-sm text-amber-400 font-semibold hover:text-amber-300">
          View Details →
        </Link>
      </div>
    </div>
  );
}
