"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface PricingConfig {
  id: string;
  category: string;
  key: string;
  value: number;
  label?: string;
  description?: string;
}

interface Grouped { [category: string]: PricingConfig[] }

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };
const inputCls = "px-3 py-2 text-sm border border-amber-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white bg-white/5";

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
    if (!confirm("Reset all pricing to defaults? This will restore default values for every key.")) return;
    setSaving(true); setError(""); setSuccess("");
    const res = await api.post("/admin/pricing/reset", {});
    if (res.success) { setSuccess("Pricing reset to defaults."); await fetchPricing(); }
    else setError(res.error ?? "Failed");
    setSaving(false);
  }

  async function seedMissing() {
    setSaving(true); setError(""); setSuccess("");
    const res = await api.post("/admin/pricing/seed-missing", {});
    if (res.success && res.data) {
      const { added } = res.data as { added: number };
      setSuccess(added > 0 ? `Added ${added} new pricing row(s).` : "All rows already present — nothing to add.");
      await fetchPricing();
    } else setError(res.error ?? "Failed");
    setSaving(false);
  }

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg px-4 py-3 text-sm">{success}</div>}

      {/* Bulk Controls */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Bulk Update</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1">Category (optional)</label>
            <select value={bulkCat} onChange={(e) => setBulkCat(e.target.value)} className={inputCls} style={{ background: "rgba(255,255,255,0.05)" }}>
              <option value="" style={{ background: "#1a1a1a" }}>All categories</option>
              {categories.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1">Change %</label>
            <input type="number" value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} className={`w-24 ${inputCls}`} placeholder="±%" />
          </div>
          <button onClick={bulkUpdate} disabled={saving} className="px-5 py-2 text-sm font-black text-black rounded-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>{saving ? "Applying…" : "Apply"}</button>
          <button onClick={seedMissing} disabled={saving} className="px-5 py-2 text-sm font-semibold border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/10 disabled:opacity-50">Add Missing Rows</button>
          <button onClick={resetPricing} disabled={saving} className="px-5 py-2 text-sm font-semibold border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50">Reset All to Defaults</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-amber-900/20 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setTab(c)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === c ? "border-amber-400 text-amber-400" : "border-transparent text-white/40 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Items */}
          {tab && grouped[tab] && (
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
              <table className="min-w-full divide-y divide-white/8">
                <thead className="bg-white/3">
                  <tr className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Key</th>
                    <th className="px-4 py-3 text-left">Label</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-right">Value</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {grouped[tab].map((item, idx) => {
                    const edited = edits[item.id] !== undefined;
                    const displayVal = edits[item.id] ?? String(item.value);
                    return (
                      <tr key={item.id} className="hover:bg-amber-500/6 transition-colors" style={{ background: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <td className="px-4 py-3 text-sm font-mono text-amber-400">{item.key}</td>
                        <td className="px-4 py-3 text-sm text-white/55">{item.label ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-white/40 max-w-[200px]">{item.description ?? ""}</td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={displayVal}
                            onChange={(e) => setEdits((ed) => ({ ...ed, [item.id]: e.target.value }))}
                            step="0.01"
                            className={`w-24 px-2 py-1 text-sm font-mono text-right border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white ${edited ? "border-amber-400/40 bg-amber-500/10" : "border-amber-900/20 bg-white/5"}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => saveItem(item)}
                            disabled={!edited || saving}
                            className="text-xs font-medium text-emerald-400 border border-emerald-500/20 rounded px-2 py-1 hover:bg-emerald-500/10 disabled:opacity-40">
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
      <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Price Simulator</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1">Items</label>
            <input type="number" value={simItems} onChange={(e) => setSimItems(e.target.value)} min="1" className={`w-20 ${inputCls}`} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1">Floors</label>
            <input type="number" value={simFloor} onChange={(e) => setSimFloor(e.target.value)} min="1" className={`w-20 ${inputCls}`} />
          </div>
          <button
            onClick={() => {
              const base = grouped["BASE"]?.[0]?.value ?? 60;
              const perItem = grouped["ITEMS"]?.[0]?.value ?? 5;
              const perFloor = grouped["FLOORS"]?.[0]?.value ?? 10;
              setSimResult(base + (parseInt(simItems) - 1) * perItem + (parseInt(simFloor) - 1) * perFloor);
            }}
            className="px-5 py-2 text-sm font-black text-black rounded-lg"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            Simulate
          </button>
        </div>
        {simResult !== null && (
          <p className="text-lg font-black font-mono text-white">Estimated price: <span className="text-amber-400">£{simResult.toFixed(2)}</span></p>
        )}
      </div>
    </div>
  );
}
