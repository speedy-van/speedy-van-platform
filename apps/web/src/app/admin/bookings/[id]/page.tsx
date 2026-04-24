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
interface BookingItem { id: string; label: string; quantity: number; unitPrice: number; subtotal: number }
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
      // Also update status if changed
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

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!booking) return <div className="text-center py-16 text-slate-500">Booking not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.push("/admin/bookings")} className="text-sm text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1">← Back</button>
          <h2 className="text-xl font-bold text-slate-900 font-mono">{booking.reference}</h2>
          <p className="text-sm text-slate-500 mt-1">{booking.customerName} — {booking.customerEmail}</p>
        </div>
        <StatusBadge status={booking.status} size="md" />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Booking Info</h3>
          <Row label="Service" value={booking.serviceName} />
          <Row label="Date" value={new Date(booking.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
          {booking.selectedTimeSlot && <Row label="Time Slot" value={booking.selectedTimeSlot} />}
          <Row label="Pickup" value={booking.pickupAddress} />
          {booking.dropoffAddress && <Row label="Dropoff" value={booking.dropoffAddress} />}
          {booking.notes && <Row label="Notes" value={booking.notes} />}
          <Row label="Phone" value={booking.customerPhone ?? "—"} />
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Payment</h3>
          {booking.payment ? (
            <>
              <Row label="Amount" value={`£${booking.payment.amount.toFixed(2)}`} mono />
              <Row label="Status" value={booking.payment.status} />
              {booking.payment.paidAt && <Row label="Paid At" value={new Date(booking.payment.paidAt).toLocaleString("en-GB")} />}
              {booking.payment.stripePaymentIntentId && (
                <Row label="Stripe PI" value={booking.payment.stripePaymentIntentId} mono />
              )}
            </>
          ) : <p className="text-sm text-slate-400">No payment record</p>}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Total: <span className="font-mono">£{booking.totalPrice.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {/* Items */}
      {booking.items?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Items</h3></div>
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold text-slate-500 uppercase">
                <th className="px-4 py-2 text-left">Label</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Unit</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {booking.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm text-slate-800">{item.label}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm font-mono text-right">£{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm font-mono font-semibold text-right">£{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status + Driver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Update Status</h3>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="Note (optional)" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-2">
            <button onClick={changeStatus} disabled={saving} className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving…" : "Update Status"}
            </button>
            <button onClick={() => setShowCancel(true)} className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              Cancel
            </button>
          </div>
        </div>

        {/* Assign Driver */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Assign Driver</h3>
          {booking.driver && (
            <div className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              Currently: <span className="font-semibold">{booking.driver.user.name}</span> ({booking.driver.vanSize})
            </div>
          )}
          <select value={assignDriverId} onChange={(e) => setAssignDriverId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">— Select driver —</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.user.name} ({d.vanSize})</option>)}
          </select>
          <button onClick={assignDriver} disabled={saving || !assignDriverId} className="w-full bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Saving…" : "Assign Driver"}
          </button>
        </div>
      </div>

      {/* Tracking Events */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Tracking Log</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {(booking.trackingEvents ?? []).length === 0 ? (
            <p className="text-sm text-slate-400">No events yet</p>
          ) : booking.trackingEvents.map((ev) => (
            <div key={ev.id} className={`flex gap-3 text-sm rounded-lg px-3 py-2 ${ev.isInternal ? "bg-amber-50 border border-amber-100" : "bg-slate-50"}`}>
              <span className="text-slate-400 whitespace-nowrap text-xs pt-0.5">{new Date(ev.createdAt).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}</span>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">{ev.type}</span>
                {ev.isInternal && <span className="ml-2 text-xs font-semibold text-amber-600">Internal</span>}
                <p className="text-slate-700">{ev.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <input value={trackMsg} onChange={(e) => setTrackMsg(e.target.value)} placeholder="Add note…" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={trackInternal} onChange={(e) => setTrackInternal(e.target.checked)} className="rounded" />
            Internal
          </label>
          <button onClick={addTrackingEvent} disabled={saving || !trackMsg.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Add</button>
        </div>
      </div>

      {/* Driver Pay */}
      {driverJob && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Driver Pay</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Driver Pay (£)</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-400">£</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={payOverride}
                  onChange={(e) => setPayOverride(e.target.value)}
                  className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Auto-calc: £{driverJob.driverPay?.toFixed(2) ?? "—"}</p>
            </div>
            <div className="flex-1 min-w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pay Notes</label>
              <input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pay Status</label>
              <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={saveDriverPay} disabled={savingPay || !payOverride} className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {savingPay ? "Saving…" : "Save Pay"}
              </button>
              {payMsg && <span className={`text-sm font-semibold ${payMsg === "Saved!" ? "text-emerald-600" : "text-red-600"}`}>{payMsg}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Status History */}
      {(booking.statusHistory ?? []).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Status History</h3>
          <div className="space-y-2">
            {booking.statusHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(h.createdAt).toLocaleString("en-GB")}</span>
                <StatusBadge status={h.status} />
                {h.note && <span className="text-slate-600">{h.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      {booking.conversation?.id && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Customer Chat</h3>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Cancel Booking</h3>
            <p className="text-sm text-slate-600">This will cancel <span className="font-mono font-semibold">{booking.reference}</span>. Provide a reason:</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Reason for cancellation…" />
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Keep Booking</button>
              <button onClick={cancelBooking} disabled={saving} className="flex-1 py-2 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50">
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
      <span className="text-xs font-semibold text-slate-500 w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-slate-800 break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
