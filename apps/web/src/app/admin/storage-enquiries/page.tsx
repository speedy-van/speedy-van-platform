"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";

type StorageStatus = "new" | "under_review" | "quoted" | "closed";

interface StorageEnquiry {
  id: string;
  reference: string;
  status: StorageStatus;
  firstName: string;
  lastName: string | null;
  customerEmail: string;
  customerPhone: string;
  storageStartKind: string;
  storageStartDate: string | null;
  storageDuration: string;
  estimatedUnitSize: string;
  needsCollectionTransport: boolean;
  collectionAddress: string | null;
  collectionPostcode: string;
  collectionAccess: unknown;
  storageFacilityKnown: boolean;
  storageFacility: unknown;
  needsReturnTransport: boolean;
  returnDestinationKnown: boolean;
  returnAddress: string | null;
  returnPostcode: string | null;
  returnDateKind: string | null;
  returnDate: string | null;
  itemDescription: string;
  needsPacking: boolean;
  needsDismantling: boolean;
  notes: string | null;
  quotedTransportPrice: number | null;
  quotedStoragePrice: number | null;
  quotePeriod: string | null;
  quoteNotes: string | null;
  adminNotes: string | null;
  quoteSentAt: string | null;
  quoteEmailStatus: string | null;
  quoteEmailError: string | null;
  notificationStatus: string | null;
  notificationError: string | null;
  createdAt: string;
}

const STATUSES: Array<"" | StorageStatus> = ["", "new", "under_review", "quoted", "closed"];
const QUOTE_PERIODS = ["week", "month", "total", "custom"] as const;
const inputCls = "px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-white/30 border border-amber-900/20 bg-white/5";
const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

function customerName(enquiry: Pick<StorageEnquiry, "firstName" | "lastName">): string {
  return [enquiry.firstName, enquiry.lastName ?? ""].map((part) => part.trim()).filter(Boolean).join(" ");
}

function label(value: string | null | undefined): string {
  return value ? value.replace(/_/g, " ") : "-";
}

function jsonObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function jsonText(value: unknown, key: string): string {
  const object = jsonObject(value);
  const item = object?.[key];
  return typeof item === "string" && item.trim() ? item : "-";
}

function boolLabel(value: boolean | null | undefined): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "-";
}

function dateLabel(value: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function money(value: number | null): string {
  return value != null ? `GBP ${value.toFixed(2)}` : "-";
}

function numberValue(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function AdminStorageEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<StorageEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | StorageStatus>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<StorageEnquiry | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const limit = 20;

  const fetchList = useCallback(async () => {
    setLoading(true);
    setListError(null);
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await api.get<StorageEnquiry[]>(`/admin/storage-enquiries?${params}`);
    if (res.success && res.data) {
      setEnquiries(Array.isArray(res.data) ? res.data : []);
      setTotal(res.pagination?.total ?? res.data.length);
    } else {
      setListError(res.error ?? "Could not load storage enquiries");
    }
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  async function openDetail(id: string) {
    const res = await api.get<StorageEnquiry>(`/admin/storage-enquiries/${id}`);
    if (res.success && res.data) setSelected(res.data);
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-white">Storage Enquiries</h1>
        <p className="mt-1 text-sm text-white/55">
          Manual storage quote requests. These are not bookings and no payment intent is created.
        </p>
      </div>

      {listError ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{listError}</div> : null}

      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search reference, name, email, phone, postcode..."
          className={`min-w-[220px] flex-1 ${inputCls}`}
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "" | StorageStatus);
            setPage(1);
          }}
          className={inputCls}
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {STATUSES.map((item) => (
            <option key={item || "all"} value={item} style={{ background: "#1a1a1a" }}>
              {item ? label(item) : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl" style={cardStyle}>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-white/40">No storage enquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/8">
              <thead className="bg-white/3">
                <tr className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Storage need</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Quote</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8 text-sm">
                {enquiries.map((enquiry, idx) => (
                  <tr key={enquiry.id} className="transition-colors hover:bg-amber-500/6" style={{ background: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td className="whitespace-nowrap px-4 py-3 text-white/55">{dateLabel(enquiry.createdAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-300">{enquiry.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{customerName(enquiry)}</div>
                      <div className="text-xs text-white/40">{enquiry.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-white/55">
                      <span className="font-semibold text-white/75">{label(enquiry.estimatedUnitSize)}</span>
                      <span className="block text-xs">{label(enquiry.storageDuration)} from {enquiry.collectionPostcode}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={enquiry.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-400">
                      {[enquiry.quotedTransportPrice, enquiry.quotedStoragePrice].some((value) => value != null)
                        ? `${money(enquiry.quotedTransportPrice)} / ${money(enquiry.quotedStoragePrice)}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => void openDetail(enquiry.id)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 ? (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-amber-900/20 px-3 py-1.5 text-sm text-white/55 hover:bg-white/5 hover:text-white disabled:opacity-50">
            Prev
          </button>
          <span className="px-3 py-1.5 text-sm text-white/55">Page {page} of {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="rounded border border-amber-900/20 px-3 py-1.5 text-sm text-white/55 hover:bg-white/5 hover:text-white disabled:opacity-50">
            Next
          </button>
        </div>
      ) : null}

      {selected ? (
        <StorageEnquiryModal
          enquiry={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setSelected(updated);
            setEnquiries((items) => items.map((item) => (item.id === updated.id ? updated : item)));
          }}
          onRefresh={fetchList}
        />
      ) : null}
    </div>
  );
}

function DetailRow({ label: rowLabel, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-white/40">{rowLabel}</dt>
      <dd className="col-span-2 whitespace-pre-wrap text-white/70">{value}</dd>
    </>
  );
}

function StorageEnquiryModal({
  enquiry,
  onClose,
  onSaved,
  onRefresh,
}: {
  enquiry: StorageEnquiry;
  onClose: () => void;
  onSaved: (updated: StorageEnquiry) => void;
  onRefresh: () => Promise<void>;
}) {
  const [status, setStatus] = useState<StorageStatus>(enquiry.status);
  const [transportPrice, setTransportPrice] = useState(enquiry.quotedTransportPrice != null ? String(enquiry.quotedTransportPrice) : "");
  const [storagePrice, setStoragePrice] = useState(enquiry.quotedStoragePrice != null ? String(enquiry.quotedStoragePrice) : "");
  const [quotePeriod, setQuotePeriod] = useState(enquiry.quotePeriod ?? "month");
  const [quoteNotes, setQuoteNotes] = useState(enquiry.quoteNotes ?? "");
  const [adminNotes, setAdminNotes] = useState(enquiry.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const modalInputCls = "w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-white/30 border border-amber-900/20 bg-white/5";

  const access = jsonObject(enquiry.collectionAccess);
  const facility = jsonObject(enquiry.storageFacility);
  const transportNumber = numberValue(transportPrice);
  const storageNumber = numberValue(storagePrice);
  const quoteReady =
    (typeof transportNumber === "number" && !Number.isNaN(transportNumber) && transportNumber > 0) ||
    (typeof storageNumber === "number" && !Number.isNaN(storageNumber) && storageNumber > 0);

  async function save() {
    setSaving(true);
    setMessage(null);
    if (Number.isNaN(transportNumber) || Number.isNaN(storageNumber)) {
      setMessage("Quote prices must be valid numbers.");
      setSaving(false);
      return;
    }

    const res = await api.patch<StorageEnquiry>(`/admin/storage-enquiries/${enquiry.id}`, {
      status,
      quotedTransportPrice: transportNumber,
      quotedStoragePrice: storageNumber,
      quotePeriod,
      quoteNotes: quoteNotes.trim() || null,
      adminNotes: adminNotes.trim() || null,
    });
    if (res.success && res.data) {
      onSaved(res.data);
      setMessage("Saved.");
    } else {
      setMessage(res.error ?? "Save failed.");
    }
    setSaving(false);
  }

  async function sendQuote() {
    if (!quoteReady) return;
    if (!confirm(`Send this storage quote to ${enquiry.customerEmail}?`)) return;
    setSending(true);
    setMessage(null);
    const res = await api.post<StorageEnquiry>(`/admin/storage-enquiries/${enquiry.id}/send-quote`, {
      quotedTransportPrice: transportNumber,
      quotedStoragePrice: storageNumber,
      quotePeriod,
      quoteNotes: quoteNotes.trim() || null,
    });
    if (res.success && res.data) {
      onSaved(res.data);
      setStatus(res.data.status);
      setMessage("Quote email sent.");
      await onRefresh();
    } else {
      setMessage(res.error ?? "Could not send quote.");
    }
    setSending(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl"
        style={{ background: "#0A0A0A", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-amber-900/20 px-6 py-4" style={{ background: "#0A0A0A" }}>
          <div>
            <h2 className="text-lg font-black text-white">Storage enquiry {enquiry.reference}</h2>
            <p className="text-xs text-white/40">{customerName(enquiry)} - {dateLabel(enquiry.createdAt)}</p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-white/40 hover:text-white" aria-label="Close">
            x
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Customer</h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <DetailRow label="Name" value={customerName(enquiry)} />
              <DetailRow label="Email" value={enquiry.customerEmail} />
              <DetailRow label="Phone" value={enquiry.customerPhone} />
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Storage request</h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <DetailRow label="Start" value={enquiry.storageStartKind === "known" ? dateLabel(enquiry.storageStartDate) : "Not decided"} />
              <DetailRow label="Duration" value={label(enquiry.storageDuration)} />
              <DetailRow label="Estimated size" value={label(enquiry.estimatedUnitSize)} />
              <DetailRow label="Items" value={enquiry.itemDescription} />
              <DetailRow label="Packing" value={boolLabel(enquiry.needsPacking)} />
              <DetailRow label="Dismantling" value={boolLabel(enquiry.needsDismantling)} />
              <DetailRow label="Customer notes" value={enquiry.notes ?? "-"} />
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Collection and access</h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <DetailRow label="Transport needed" value={boolLabel(enquiry.needsCollectionTransport)} />
              <DetailRow label="Collection" value={[enquiry.collectionAddress, enquiry.collectionPostcode].filter(Boolean).join(", ")} />
              <DetailRow label="Property" value={label(jsonText(access, "propertyType"))} />
              <DetailRow label="Floor" value={String(access?.floor ?? "-")} />
              <DetailRow label="Lift" value={boolLabel(typeof access?.hasLift === "boolean" ? access.hasLift : null)} />
              <DetailRow label="Carry distance" value={access?.carryDistanceMetres ? `${access.carryDistanceMetres}m` : "-"} />
              <DetailRow label="Narrow access" value={boolLabel(access?.narrowAccess === true)} />
              <DetailRow label="Permit or restriction" value={boolLabel(access?.permitOrRestrictedParking === true)} />
              <DetailRow label="Access notes" value={jsonText(access, "accessNotes")} />
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Storage and return</h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <DetailRow label="Facility known" value={boolLabel(enquiry.storageFacilityKnown)} />
              <DetailRow label="Facility" value={enquiry.storageFacilityKnown ? [jsonText(facility, "address"), jsonText(facility, "postcode")].filter((value) => value !== "-").join(", ") || "-" : "Not decided"} />
              <DetailRow label="Return transport" value={boolLabel(enquiry.needsReturnTransport)} />
              <DetailRow label="Return destination" value={enquiry.returnDestinationKnown ? [enquiry.returnAddress, enquiry.returnPostcode].filter(Boolean).join(", ") : "Not decided"} />
              <DetailRow label="Return date" value={enquiry.returnDateKind === "known" ? dateLabel(enquiry.returnDate) : enquiry.needsReturnTransport ? "Not decided" : "-"} />
            </dl>
          </section>

          <section className="space-y-4 rounded-xl border border-amber-900/20 bg-white/3 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Quote control</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white/40">Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as StorageStatus)} className={modalInputCls} style={{ background: "rgba(255,255,255,0.05)" }}>
                  {STATUSES.filter(Boolean).map((item) => <option key={item} value={item} style={{ background: "#1a1a1a" }}>{label(item)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white/40">Quote period</span>
                <select value={quotePeriod} onChange={(e) => setQuotePeriod(e.target.value)} className={modalInputCls} style={{ background: "rgba(255,255,255,0.05)" }}>
                  {QUOTE_PERIODS.map((item) => <option key={item} value={item} style={{ background: "#1a1a1a" }}>{label(item)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white/40">Transport price (GBP)</span>
                <input value={transportPrice} onChange={(e) => setTransportPrice(e.target.value)} inputMode="decimal" className={modalInputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white/40">Storage price (GBP)</span>
                <input value={storagePrice} onChange={(e) => setStoragePrice(e.target.value)} inputMode="decimal" className={modalInputCls} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-white/40">Quote notes for customer</span>
              <textarea rows={3} value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} className={modalInputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-white/40">Admin notes</span>
              <textarea rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className={modalInputCls} />
            </label>
            {enquiry.quoteSentAt ? <p className="text-xs text-emerald-400">Quote last sent: {new Date(enquiry.quoteSentAt).toLocaleString("en-GB")}</p> : null}
            {enquiry.quoteEmailStatus === "failed" && enquiry.quoteEmailError ? <p className="text-xs text-red-300">Last email error: {enquiry.quoteEmailError}</p> : null}
            {message ? <p className="rounded border border-amber-900/20 bg-white/3 p-2 text-sm text-white/55">{message}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void save()} disabled={saving} className="rounded-lg border border-amber-900/20 px-4 py-2 text-sm font-semibold text-white/55 hover:bg-white/5 hover:text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => void sendQuote()} disabled={sending || !quoteReady} className="rounded-lg px-4 py-2 text-sm font-black text-black disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
                {sending ? "Sending..." : "Send quote"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
