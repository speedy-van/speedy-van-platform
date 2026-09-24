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
  PENDING: "bg-amber-500/15 text-amber-400",
  CONFIRMED: "bg-emerald-500/15 text-emerald-400",
  ASSIGNED: "bg-amber-500/15 text-amber-400",
  IN_PROGRESS: "bg-amber-500/15 text-amber-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-400",
  AVAILABLE: "bg-emerald-500/15 text-emerald-400",
  CLAIMED: "bg-amber-500/15 text-amber-400",
  ACCEPTED: "bg-emerald-500/15 text-emerald-400",
  new: "bg-amber-500/15 text-amber-400",
  quoted: "bg-amber-500/15 text-amber-400",
  accepted: "bg-emerald-500/15 text-emerald-400",
  declined: "bg-red-500/15 text-red-400",
};

interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const cls = STATUS_CLASSES[status] ?? "bg-white/8 text-white/55";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"} ${cls}`}>
      {label}
    </span>
  );
}
