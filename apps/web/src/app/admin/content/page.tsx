"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
  type: string;
}

interface Grouped { [section: string]: ContentItem[] }

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };
const inputCls = "px-3 py-2 text-sm border border-amber-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white bg-white/5 placeholder-white/30";

export default function ContentPage() {
  const [grouped, setGrouped] = useState<Grouped>({});
  const [tab, setTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ section: "", key: "", value: "", type: "text" });

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ items: ContentItem[] }>("/admin/content");
    if (res.success && res.data) {
      const g: Grouped = {};
      for (const item of res.data.items ?? []) {
        if (!g[item.section]) g[item.section] = [];
        g[item.section].push(item);
      }
      setGrouped(g);
      if (!tab && Object.keys(g).length > 0) setTab(Object.keys(g)[0]);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  async function saveItem(item: ContentItem) {
    const value = edits[item.id];
    if (value === undefined) return;
    setSaving(true); setError(""); setSuccess("");
    const res = await api.put("/admin/content", { section: item.section, key: item.key, value, type: item.type });
    if (res.success) {
      setSuccess("Saved.");
      setEdits((e) => { const n = { ...e }; delete n[item.id]; return n; });
      await fetchContent();
    } else setError(res.error ?? "Failed to save");
    setSaving(false);
  }

  async function deleteItem(item: ContentItem) {
    if (!confirm(`Delete "${item.key}"?`)) return;
    setSaving(true);
    await api.delete(`/admin/content/${item.id}`);
    await fetchContent();
    setSaving(false);
  }

  async function createItem() {
    setError(""); setSuccess("");
    const section = draft.section.trim();
    const key = draft.key.trim();
    if (!section || !key) {
      setError("Section and key are required.");
      return;
    }
    setSaving(true);
    const res = await api.put("/admin/content", {
      section, key, value: draft.value, type: draft.type,
    });
    if (res.success) {
      setSuccess("Created.");
      setShowAdd(false);
      setTab(section);
      setDraft({ section: "", key: "", value: "", type: "text" });
      await fetchContent();
    } else {
      setError(res.error ?? "Failed to create");
    }
    setSaving(false);
  }

  const sections = Object.keys(grouped);

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg px-4 py-3 text-sm">{success}</div>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-white/55">
          Edit copy that appears across the site. Group entries by <span className="font-mono text-amber-400">section</span> and reference them by <span className="font-mono text-amber-400">key</span>.
        </p>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="text-sm font-black text-black rounded-lg px-3 py-1.5"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
        >
          {showAdd ? "Cancel" : "+ New entry"}
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-amber-900/20 p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)" }}>
          <h2 className="text-sm font-semibold text-white">Create content entry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={draft.section}
              onChange={(e) => setDraft((d) => ({ ...d, section: e.target.value }))}
              placeholder="Section (e.g. home_hero)"
              className={inputCls}
            />
            <input
              value={draft.key}
              onChange={(e) => setDraft((d) => ({ ...d, key: e.target.value }))}
              placeholder="Key (e.g. headline)"
              className={inputCls}
            />
            <select
              value={draft.type}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
              className={inputCls}
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <option value="text" style={{ background: "#1a1a1a" }}>Text</option>
              <option value="html" style={{ background: "#1a1a1a" }}>HTML</option>
              <option value="markdown" style={{ background: "#1a1a1a" }}>Markdown</option>
              <option value="json" style={{ background: "#1a1a1a" }}>JSON</option>
            </select>
          </div>
          <textarea
            value={draft.value}
            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            placeholder="Value"
            rows={3}
            className={`w-full resize-y ${inputCls}`}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={createItem}
              disabled={saving}
              className="text-sm font-black text-black rounded-lg px-4 py-2 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-amber-900/20 p-10 text-center bg-white/3">
          <p className="text-3xl mb-2" aria-hidden>📝</p>
          <p className="text-sm font-semibold text-white">No content entries yet</p>
          <p className="text-xs text-white/40 mt-1">Click <strong className="text-white/70">+ New entry</strong> above to add your first piece of content.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 border-b border-amber-900/20 overflow-x-auto">
            {sections.map((s) => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === s ? "border-amber-400 text-amber-400" : "border-transparent text-white/40 hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>

          {tab && grouped[tab] && (
            <div className="space-y-4">
              {grouped[tab].map((item) => {
                const val = edits[item.id] ?? item.value;
                const edited = edits[item.id] !== undefined;
                const isLong = item.type === "TEXT" || (item.value?.length ?? 0) > 100;
                return (
                  <div key={item.id} className="rounded-xl p-5 space-y-3" style={cardStyle}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.key}</p>
                        <p className="text-xs text-white/40">{item.section} · {item.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveItem(item)}
                          disabled={!edited || saving}
                          className="text-xs font-medium text-emerald-400 border border-emerald-500/20 rounded px-2.5 py-1 hover:bg-emerald-500/10 disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          disabled={saving}
                          className="text-xs font-medium text-red-400 border border-red-500/20 rounded px-2.5 py-1 hover:bg-red-500/10 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {isLong ? (
                      <textarea
                        value={val}
                        onChange={(e) => setEdits((ed) => ({ ...ed, [item.id]: e.target.value }))}
                        rows={4}
                        className={`w-full resize-y ${inputCls} ${edited ? "border-amber-400/40 bg-amber-500/10" : ""}`}
                      />
                    ) : (
                      <input
                        value={val}
                        onChange={(e) => setEdits((ed) => ({ ...ed, [item.id]: e.target.value }))}
                        className={`w-full ${inputCls} ${edited ? "border-amber-400/40 bg-amber-500/10" : ""}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
