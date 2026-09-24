"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth-client";
import StatusBadge from "@/components/admin/StatusBadge";
import { ChatWindow } from "@/components/chat/ChatWindow";

interface Driver { id: string; user: { name: string }; vanSize: string }
interface TrackingEvent { id: string; type: string; message: string; isInternal: boolean; createdAt: string; lat?: number; lng?: number }
interface StatusHistory { id: string; status: string; note?: string; createdAt: string }
interface BookingItem { id: string; name: string; quantity: number }
interface DriverJob { id: string; status: string; driverPay?: number; driverPayStatus: string; driverPayNotes?: string }
interface BookingDetail {
  id: string; reference: string; customerName: string; customerEmail: string; customerPhone?: string;
  serviceName: string; scheduledAt: string; selectedTimeSlot?: string; status: string;
  totalPrice: number; notes?: string; pickupAddress: string; dropoffAddress?: string;
  driver?: Driver;
  items: BookingItem[];
  trackingEvents: TrackingEvent[];
  statusHistory: StatusHistory[];
  payment?: { stripePaymentIntentId?: string; amount: number; status: string; paidAt?: string };
  conversation?: { id: string } | null;
}

const STATUSES = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };
const inputCls = "w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-white/30 border border-amber-900/20 bg-white/5";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [assignDriverId, setAssignDriverId] = useState("");
  const [trackMsg, setTrackMsg] = useState("");
  const [trackInternal, setTrackInternal] = useState(false);

  // Driver Pay
  const [driverJob, setDriverJob] = useState<DriverJob | null>(null);
  const [payOverride, setPayOverride] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [payStatus, setPayStatus] = useState("unpaid");
  const [savingPay, setSavingPay] = useState(false);
  const [payMsg, setPayMsg] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<BookingDetail>(`/admin/bookings/${id}`),
      api.get<{ drivers: Driver[] }>("/admin/drivers"),
      api.get<{ jobs: DriverJob[] }>(`/admin/jobs?bookingId=${id}`),
    ]).then(([b, d, j]) => {
      if (b.success && b.data) { setBooking(b.data); setNewStatus(b.data.status); }
      if (d.success && d.data) setDrivers(d.data.drivers ?? []);
      if (j.success && j.data) {
        const dj = j.data.jobs?.[0] ?? null;
        setDriverJob(dj);
        if (dj) {
          setPayOverride(dj.driverPay?.toFixed(2) ?? "");
          setPayNotes(dj.driverPayNotes ?? "");
          setPayStatus(dj.driverPayStatus ?? "unpaid");
        }
      }
    }).finally(() => setLoading(false));
  }, [id]);

  async function changeStatus() {
    if (!booking || !newStatus) return;
    setSaving(true); setError("");
    const res = await api.patch(`/admin/bookings/${id}/status`, { status: newStatus, note: statusNote });
    if (res.success) {
      setBooking((b) => b ? { ...b, status: newStatus } : b);
      setStatusNote("");
    } else setError(res.error ?? "Failed to update status");
    setSaving(false);
  }

  async function assignDriver() {
    if (!assignDriverId) return;
    setSaving(true); setError("");
    const res = await api.post(`/admin/bookings/${id}/assign`, { driverId: assignDriverId });
    if (res.success) {
      const found = drivers.find((d) => d.id === assignDriverId);
      setBooking((b) => b ? { ...b, driver: found } : b);
    } else setError(res.error ?? "Failed to assign driver");
    setSaving(false);
  }

  async function cancelBooking() {
    setSaving(true); setError("");
    const res = await api.post(`/admin/bookings/${id}/cancel`, { reason: cancelReason });
    if (res.success) { setBooking((b) => b ? { ...b, status: "CANCELLED" } : b); setShowCancel(false); }
    else setError(res.error ?? "Failed to cancel");
    setSaving(false);
  }

  async function addTrackingEvent() {
    if (!trackMsg.trim()) return;
    setSaving(true);
    const res = await api.post(`/admin/bookings/${id}/tracking`, { type: "NOTE", message: trackMsg, isInternal: trackInternal });
    if (res.success) {
      setBooking((b) => b ? {
        ...b,
        trackingEvents: [...(b.trackingEvents ?? []), { id: Date.now().toString(), type: "NOTE", message: trackMsg, isInternal: trackInternal, createdAt: new Date().toISOString() }]
      } : b);
      setTrackMsg("");
    }
    setSaving(false);
  }

  async function saveDriverPay() {
    if (!driverJob) return;
    setSavingPay(true); setPayMsg("");
    const res = await api.patch(`/admin/jobs/${driverJob.id}/driver-pay`, {
      driverPay: parseFloat(payOverride),
      driverPayNotes: payNotes,
    });
    if (res.success) {
      if (payStatus !== driverJob.driverPayStatus) {
        await api.patch(`/admin/jobs/${driverJob.id}`, { status: driverJob.status, isPublic: false });
      }
      setDriverJob((dj) => dj ? { ...dj, driverPay: parseFloat(payOverride), driverPayNotes: payNotes } : dj);
      setPayMsg("Saved!");
    } else {
      setPayMsg(res.error ?? "Failed");
    }
    setTimeout(() => setPayMsg(""), 3000);
    setSavingPay(false);
  }

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!booking) return <div className="text-center py-16 text-white/40">Booking not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.push("/admin/bookings")} className="text-sm text-white/40 hover:text-white/70 mb-2 flex items-center gap-1">← Back</button>
          <h2 className="text-xl font-black text-white font-mono">{booking.reference}</h2>
          <p className="text-sm text-white/55 mt-1">{booking.customerName} — {booking.customerEmail}</p>
        </div>
        <StatusBadge status={booking.status} size="md" />
      </div>

      {error && <div className="rounded-lg px-4 py-3 text-sm text-red-400 border border-red-500/20 bg-red-500/10">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Info */}
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Booking Info</h3>
          <Row label="Service" value={booking.serviceName} />
          <Row label="Date" value={new Date(booking.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
          {booking.selectedTimeSlot && <Row label="Time Slot" value={booking.selectedTimeSlot} />}
          <Row label="Pickup" value={booking.pickupAddress} />
          {booking.dropoffAddress && <Row label="Dropoff" value={booking.dropoffAddress} />}
          {booking.notes && <Row label="Notes" value={booking.notes} />}
          <Row label="Phone" value={booking.customerPhone ?? "—"} />
        </div>

        {/* Payment Info */}
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Payment</h3>
          {booking.payment ? (
            <>
              <Row label="Amount" value={`£${booking.payment.amount.toFixed(2)}`} mono />
              <Row label="Status" value={booking.payment.status} />
              {booking.payment.paidAt && <Row label="Paid At" value={new Date(booking.payment.paidAt).toLocaleString("en-GB")} />}
              {booking.payment.stripePaymentIntentId && (
                <Row label="Stripe PI" value={booking.payment.stripePaymentIntentId} mono />
              )}
            </>
          ) : <p className="text-sm text-white/40">No payment record</p>}
          <div className="pt-2 border-t border-amber-900/20">
            <p className="text-sm font-semibold text-white">Total: <span className="font-mono">£{booking.totalPrice.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {/* Items */}
      {booking.items?.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          <div className="px-5 py-3 border-b border-amber-900/20"><h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Items</h3></div>
          <table className="min-w-full divide-y divide-white/8">
            <thead className="bg-white/3">
              <tr className="text-xs font-semibold text-white/40 uppercase">
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {booking.items.map((item) => (
                <tr key={item.id} className="hover:bg-amber-500/6">
                  <td className="px-4 py-2 text-sm text-white/55">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-right text-white/55">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status + Driver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Status */}
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Update Status</h3>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={inputCls} style={{ background: "rgba(255,255,255,0.05)" }}>
            {STATUSES.map((s) => <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s}</option>)}
          </select>
          <input value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="Note (optional)" className={inputCls} />
          <div className="flex gap-2">
            <button onClick={changeStatus} disabled={saving} className="flex-1 text-black text-sm font-black py-2 rounded-lg disabled:opacity-50 transition-opacity" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
              {saving ? "Saving…" : "Update Status"}
            </button>
            <button onClick={() => setShowCancel(true)} className="px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10">
              Cancel
            </button>
          </div>
        </div>

        {/* Assign Driver */}
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Assign Driver</h3>
          {booking.driver && (
            <div className="text-sm text-white/55 rounded-lg px-3 py-2 border border-amber-900/20 bg-white/3">
              Currently: <span className="font-semibold text-white">{booking.driver.user.name}</span> ({booking.driver.vanSize})
            </div>
          )}
          <select value={assignDriverId} onChange={(e) => setAssignDriverId(e.target.value)} className={inputCls} style={{ background: "rgba(255,255,255,0.05)" }}>
            <option value="" style={{ background: "#1a1a1a" }}>— Select driver —</option>
            {drivers.map((d) => <option key={d.id} value={d.id} style={{ background: "#1a1a1a" }}>{d.user.name} ({d.vanSize})</option>)}
          </select>
          <button onClick={assignDriver} disabled={saving || !assignDriverId} className="w-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-sm font-semibold py-2 rounded-lg hover:bg-emerald-500/25 disabled:opacity-50">
            {saving ? "Saving…" : "Assign Driver"}
          </button>
        </div>
      </div>

      {/* Tracking Events */}
      <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Tracking Log</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {(booking.trackingEvents ?? []).length === 0 ? (
            <p className="text-sm text-white/40">No events yet</p>
          ) : booking.trackingEvents.map((ev) => (
            <div key={ev.id} className={`flex gap-3 text-sm rounded-lg px-3 py-2 ${ev.isInternal ? "bg-amber-500/8 border border-amber-900/20" : "bg-white/3"}`}>
              <span className="text-white/40 whitespace-nowrap text-xs pt-0.5">{new Date(ev.createdAt).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}</span>
              <div>
                <span className="text-xs font-semibold text-white/40 uppercase">{ev.type}</span>
                {ev.isInternal && <span className="ml-2 text-xs font-semibold text-amber-400">Internal</span>}
                <p className="text-white/55">{ev.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-amber-900/20">
          <input value={trackMsg} onChange={(e) => setTrackMsg(e.target.value)} placeholder="Add note…" className={`flex-1 ${inputCls}`} style={{ width: undefined }} />
          <label className="flex items-center gap-1 text-xs text-white/40 cursor-pointer">
            <input type="checkbox" checked={trackInternal} onChange={(e) => setTrackInternal(e.target.checked)} className="rounded" />
            Internal
          </label>
          <button onClick={addTrackingEvent} disabled={saving || !trackMsg.trim()} className="px-4 py-2 text-sm font-black text-black rounded-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>Add</button>
        </div>
      </div>

      {/* Driver Pay */}
      {driverJob && (
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Driver Pay</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1">Driver Pay (£)</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-white/40">£</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={payOverride}
                  onChange={(e) => setPayOverride(e.target.value)}
                  className="w-24 px-3 py-2 text-sm border border-amber-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono text-white bg-white/5"
                />
              </div>
              <p className="text-xs text-white/40 mt-1">Auto-calc: £{driverJob.driverPay?.toFixed(2) ?? "—"}</p>
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-xs font-semibold text-white/40 mb-1">Pay Notes</label>
              <input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="Optional notes"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1">Pay Status</label>
              <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)} className={inputCls} style={{ background: "rgba(255,255,255,0.05)", width: undefined }}>
                <option value="unpaid" style={{ background: "#1a1a1a" }}>Unpaid</option>
                <option value="paid" style={{ background: "#1a1a1a" }}>Paid</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={saveDriverPay} disabled={savingPay || !payOverride} className="text-black text-sm font-black px-5 py-2 rounded-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
                {savingPay ? "Saving…" : "Save Pay"}
              </button>
              {payMsg && <span className={`text-sm font-semibold ${payMsg === "Saved!" ? "text-emerald-400" : "text-red-400"}`}>{payMsg}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Status History */}
      {(booking.statusHistory ?? []).length > 0 && (
        <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Status History</h3>
          <div className="space-y-2">
            {booking.statusHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-white/40 whitespace-nowrap">{new Date(h.createdAt).toLocaleString("en-GB")}</span>
                <StatusBadge status={h.status} />
                {h.note && <span className="text-white/55">{h.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      {booking.conversation?.id && (
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          <div className="px-5 py-4 border-b border-amber-900/20">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Customer Chat</h3>
          </div>
          <ChatWindow
            mode="authed"
            conversationId={booking.conversation.id}
            currentUserId={getUser()?.id ?? ""}
            token={getToken() ?? ""}
            title={`Chat — ${booking.reference}`}
          />
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl p-6 w-full max-w-md space-y-4" style={{ background: "#0A0A0A", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
            <h3 className="text-lg font-black text-white">Cancel Booking</h3>
            <p className="text-sm text-white/55">This will cancel <span className="font-mono font-semibold text-white">{booking.reference}</span>. Provide a reason:</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className={inputCls} placeholder="Reason for cancellation…" />
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 py-2 text-sm border border-amber-900/20 rounded-lg text-white/55 hover:text-white hover:bg-white/5">Keep Booking</button>
              <button onClick={cancelBooking} disabled={saving} className="flex-1 py-2 text-sm bg-red-500/15 text-red-400 border border-red-500/20 font-semibold rounded-lg hover:bg-red-500/25 disabled:opacity-50">
                {saving ? "Cancelling…" : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-semibold text-white/40 w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-white/55 break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
