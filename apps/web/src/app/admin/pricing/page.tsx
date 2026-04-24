"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import ProgressBar from "@/components/admin/ProgressBar";

interface PricingConfig {
  id: string;
  category: string;
  key: string;
  value: number;
  label?: string;
  description?: string;
}

interface Grouped { [category: string]: PricingConfig[] }

export default function PricingPage() {
  const [grouped, setGrouped] = useState<Grouped>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("");
  const [bulkPct, setBulkPct] = useState("0");
  const [bulkCat, setBulkCat] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [simItems, setSimItems] = useState("1");
  const [simFloor, setSimFloor] = useState("1");
  const [simResult, setSimResult] = useState<number | null>(null);

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ grouped: Grouped; items: PricingConfig[] }>("/admin/pricing");
    if (res.success && res.data) {
      setGrouped(res.data.grouped ?? {});
      if (!tab && Object.keys(res.data.grouped ?? {}).length > 0) {
        setTab(Object.keys(res.data.grouped)[0]);
      }
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  async function saveItem(item: PricingConfig) {
    const raw = edits[item.id];
    if (raw === undefined) return;
    const value = parseFloat(raw);
    if (isNaN(value)) return;
    setSaving(true); setError(""); setSuccess("");
    const res = await api.patch(`/admin/pricing/${item.id}`, { value });
    if (res.success) {
      setSuccess("Saved.");
      setEdits((e) => { const n = { ...e }; delete n[item.id]; return n; });
      await fetchPricing();
    } else setError(res.error ?? "Failed to save");
    setSaving(false);
  }

  async function bulkUpdate() {
    setSaving(true); setError(""); setSuccess("");
    const body: Record<string, unknown> = { percentage: parseFloat(bulkPct) };
    if (bulkCat) body.category = bulkCat;
    const res = await api.post("/admin/pricing/bulk-update", body);
    if (res.success) { setSuccess("Bulk update applied."); await fetchPricing(); }
    else setError(res.error ?? "Failed");
    setSaving(false);
  }

  async function resetPricing() {
    if (!confirm("Reset all pricing to defaults?")) return;
    setSaving(true); setError(""); setSuccess("");
    const res = await api.post("/admin/pricing/reset", {});
    if (res.success) { setSuccess("Pricing reset."); await fetchPricing(); }
    else setError(res.error ?? "Failed");
    setSaving(false);
  }

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">{success}</div>}

      {/* Bulk Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Bulk Update</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Category (optional)</label>
            <select value={bulkCat} onChange={(e) => setBulkCat(e.target.value)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Change %</label>
            <input type="number" value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="±%" />
          </div>
          <button onClick={bulkUpdate} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? "Applying…" : "Apply"}</button>
          <button onClick={resetPricing} disabled={saving} className="px-5 py-2 text-sm font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50">Reset All</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setTab(c)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === c ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Items */}
          {tab && grouped[tab] && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Key</th>
                    <th className="px-4 py-3 text-left">Label</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-right">Value</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {grouped[tab].map((item) => {
                    const edited = edits[item.id] !== undefined;
                    const displayVal = edits[item.id] ?? String(item.value);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-mono text-slate-700">{item.key}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{item.label ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px]">{item.description ?? ""}</td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={displayVal}
                            onChange={(e) => setEdits((ed) => ({ ...ed, [item.id]: e.target.value }))}
                            step="0.01"
                            className={`w-24 px-2 py-1 text-sm font-mono text-right border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${edited ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => saveItem(item)}
                            disabled={!edited || saving}
                            className="text-xs font-medium text-emerald-600 border border-emerald-200 rounded px-2 py-1 hover:bg-emerald-50 disabled:opacity-40">
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Price Simulator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Price Simulator</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Items</label>
            <input type="number" value={simItems} onChange={(e) => setSimItems(e.target.value)} min="1" className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Floors</label>
            <input type="number" value={simFloor} onChange={(e) => setSimFloor(e.target.value)} min="1" className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button
            onClick={() => {
              const base = grouped["BASE"]?.[0]?.value ?? 60;
              const perItem = grouped["ITEMS"]?.[0]?.value ?? 5;
              const perFloor = grouped["FLOORS"]?.[0]?.value ?? 10;
              setSimResult(base + (parseInt(simItems) - 1) * perItem + (parseInt(simFloor) - 1) * perFloor);
            }}
            className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Simulate
          </button>
        </div>
        {simResult !== null && (
          <p className="text-lg font-bold font-mono text-slate-900">Estimated price: <span className="text-blue-600">£{simResult.toFixed(2)}</span></p>
        )}
      </div>
    </div>
  );
}
