"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";

interface Enquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromAddress: string;
  propertyType: string;
  bedrooms: number;
  toCountry: string;
  toCity: string;
  preferredDate: string | null;
  flexibleDate: boolean;
  flexibleMonth: string | null;
  needsPacking: boolean;
  needsStorage: boolean;
  notes: string | null;
  status: string;
  quotedPrice: number | null;
  adminNotes: string | null;
  quoteSentAt: string | null;
  createdAt: string;
}

const STATUSES = ["", "new", "quoted", "accepted", "declined"];

const inputCls = "px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-white/30 border border-amber-900/20 bg-white/5";
const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const limit = 20;

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await api.get<{ items: Enquiry[]; total: number }>(
      `/admin/enquiries?${params}`,
    );
    if (res.success && res.data) {
      setEnquiries(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    }
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-white">European Enquiries</h1>
        <p className="text-sm text-white/55 mt-1">
          European removals quote requests. Reply with a fixed price within 24 hours.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search name, email, country, city…"
          className={`flex-1 min-w-[200px] ${inputCls}`}
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className={inputCls}
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} style={{ background: "#1a1a1a" }}>
              {s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            No enquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/8">
              <thead className="bg-white/3">
                <tr className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Quote</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8 text-sm">
                {enquiries.map((e, idx) => (
                  <tr key={e.id} className="hover:bg-amber-500/6 transition-colors" style={{ background: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td className="px-4 py-3 whitespace-nowrap text-white/55">
                      {new Date(e.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{e.customerName}</div>
                      <div className="text-xs text-white/40">{e.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-white/55">
                      Scotland → <strong className="text-white/70">{e.toCity}, {e.toCountry}</strong>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-400">
                      {e.quotedPrice != null ? `£${e.quotedPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(e)}
                        className="text-sm font-semibold text-amber-400 hover:text-amber-300"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-amber-900/20 rounded text-white/55 hover:text-white hover:bg-white/5 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-sm text-white/55">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1.5 text-sm border border-amber-900/20 rounded text-white/55 hover:text-white hover:bg-white/5 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      {selected && (
        <EnquiryModal
          enquiry={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setEnquiries((list) => list.map((e) => (e.id === updated.id ? updated : e)));
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}

interface ModalProps {
  enquiry: Enquiry;
  onClose: () => void;
  onSaved: (updated: Enquiry) => void;
}

function EnquiryModal({ enquiry, onClose, onSaved }: ModalProps) {
  const [quotedPrice, setQuotedPrice] = useState<string>(
    enquiry.quotedPrice != null ? String(enquiry.quotedPrice) : "",
  );
  const [adminNotes, setAdminNotes] = useState<string>(enquiry.adminNotes ?? "");
  const [status, setStatus] = useState<string>(enquiry.status);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const modalInputCls = "w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-white/30 border border-amber-900/20 bg-white/5";

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = { status, adminNotes };
      const priceNum = quotedPrice.trim() === "" ? null : Number(quotedPrice);
      if (priceNum != null && Number.isNaN(priceNum)) {
        setMsg("Invalid price");
        setSaving(false);
        return;
      }
      body.quotedPrice = priceNum;
      const res = await api.patch<Enquiry>(`/admin/enquiries/${enquiry.id}`, body);
      if (res.success && res.data) {
        onSaved(res.data);
        setMsg("Saved.");
      } else {
        setMsg(res.error ?? "Save failed");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const sendQuote = async () => {
    if (!confirm(`Send quote of £${quotedPrice} to ${enquiry.customerEmail}?`)) return;
    setSending(true);
    setMsg(null);
    try {
      await api.patch<Enquiry>(`/admin/enquiries/${enquiry.id}`, {
        quotedPrice: quotedPrice.trim() === "" ? null : Number(quotedPrice),
        adminNotes,
      });
      const res = await api.post<Enquiry>(
        `/admin/enquiries/${enquiry.id}/send-quote`,
        {},
      );
      if (res.success && res.data) {
        onSaved(res.data);
        setStatus(res.data.status);
        setMsg("Quote sent to customer.");
      } else {
        setMsg(res.error ?? "Could not send quote");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not send quote");
    } finally {
      setSending(false);
    }
  };

  const fmtDate = enquiry.preferredDate
    ? new Date(enquiry.preferredDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : enquiry.flexibleDate
    ? `Flexible${enquiry.flexibleMonth ? ` (${enquiry.flexibleMonth})` : ""}`
    : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "#0A0A0A", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 border-b border-amber-900/20 px-6 py-4 flex items-center justify-between" style={{ background: "#0A0A0A" }}>
          <div>
            <h2 className="text-lg font-black text-white">
              Enquiry — {enquiry.customerName}
            </h2>
            <p className="text-xs text-white/40">
              Scotland → {enquiry.toCity}, {enquiry.toCountry}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
              Customer
            </h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <dt className="text-white/40">Name</dt>
              <dd className="col-span-2 text-white">{enquiry.customerName}</dd>
              <dt className="text-white/40">Email</dt>
              <dd className="col-span-2">
                <a className="text-amber-400 hover:text-amber-300 hover:underline" href={`mailto:${enquiry.customerEmail}`}>
                  {enquiry.customerEmail}
                </a>
              </dd>
              <dt className="text-white/40">Phone</dt>
              <dd className="col-span-2">
                <a className="text-amber-400 hover:text-amber-300 hover:underline" href={`tel:${enquiry.customerPhone}`}>
                  {enquiry.customerPhone}
                </a>
              </dd>
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
              Move
            </h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <dt className="text-white/40">From</dt>
              <dd className="col-span-2 text-white">{enquiry.fromAddress}</dd>
              <dt className="text-white/40">Property</dt>
              <dd className="col-span-2 text-white">
                {enquiry.propertyType}
                {enquiry.bedrooms > 0 ? ` · ${enquiry.bedrooms} bed` : ""}
              </dd>
              <dt className="text-white/40">Destination</dt>
              <dd className="col-span-2 text-white">
                {enquiry.toCity}, {enquiry.toCountry}
              </dd>
              <dt className="text-white/40">Date</dt>
              <dd className="col-span-2 text-white">{fmtDate}</dd>
              <dt className="text-white/40">Packing</dt>
              <dd className="col-span-2 text-white">{enquiry.needsPacking ? "Yes" : "No"}</dd>
              <dt className="text-white/40">Storage</dt>
              <dd className="col-span-2 text-white">{enquiry.needsStorage ? "Yes" : "No"}</dd>
              {enquiry.notes && (
                <>
                  <dt className="text-white/40">Notes</dt>
                  <dd className="col-span-2 text-white/55 whitespace-pre-wrap">{enquiry.notes}</dd>
                </>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-amber-900/20 p-4 space-y-4 bg-white/3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
              Quote
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">
                  Status
                </label>
                <select
                  aria-label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={modalInputCls}
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {["new", "quoted", "accepted", "declined"].map((s) => (
                    <option key={s} value={s} style={{ background: "#1a1a1a" }}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1">
                  Quoted price (£)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. 1450"
                  className={modalInputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1">
                Internal/customer notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Notes that will be included in the quote email…"
                className={modalInputCls}
              />
            </div>
            {enquiry.quoteSentAt && (
              <p className="text-xs text-emerald-400">
                Quote last sent: {new Date(enquiry.quoteSentAt).toLocaleString("en-GB")}
              </p>
            )}
            {msg && (
              <p className="text-sm text-white/55 border border-amber-900/20 bg-white/3 rounded p-2">
                {msg}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold border border-amber-900/20 rounded-lg text-white/55 hover:text-white hover:bg-white/5 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={sendQuote}
                disabled={sending || !quotedPrice || Number(quotedPrice) <= 0}
                className="px-4 py-2 text-sm font-black rounded-lg text-black disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
              >
                {sending ? "Sending…" : "Send Quote →"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
