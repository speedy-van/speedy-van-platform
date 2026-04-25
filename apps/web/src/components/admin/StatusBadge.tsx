"use client";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  AVAILABLE: "Available",
  CLAIMED: "Claimed",
  ACCEPTED: "Accepted",
  new: "New",
  quoted: "Quoted",
  accepted: "Accepted",
  declined: "Declined",
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-800",
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  CLAIMED: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  new: "bg-amber-100 text-amber-800",
  quoted: "bg-blue-100 text-blue-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-slate-100 text-slate-600",
};

interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const cls = STATUS_CLASSES[status] ?? "bg-slate-100 text-slate-600";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"} ${cls}`}>
      {label}
    </span>
  );
}
