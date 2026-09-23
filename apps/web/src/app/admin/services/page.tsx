"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type FlagSlug = "rubbish-removal" | "same-day-delivery";
type FlagMode = "popup" | null;

interface ServiceFlag {
  slug: FlagSlug;
  enabled: boolean;
  mode: FlagMode;
  updatedAt: string | null;
}

interface ListResponse {
  items: ServiceFlag[];
}

const COPY: Record<FlagSlug, { name: string; icon: string; description: string; supportsPopup: boolean }> = {
  "rubbish-removal": {
    name: "Rubbish Removal",
    icon: "♻️",
    description:
      "Eco-friendly clearance of household and business waste. Turn off if you don't currently have crews available.",
    supportsPopup: false,
  },
  "same-day-delivery": {
    name: "Same Day Delivery",
    icon: "⚡",
    description:
      "Urgent same-day jobs. Choose 'Phone only' to keep the service visible but route customers to a 'please call us' popup instead of online booking.",
    supportsPopup: true,
  },
};

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<FlagSlug | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<ListResponse>("/admin/service-flags");
      if (res.success && res.data) {
        setItems(res.data.items);
      } else {
        setError(res.error ?? "Failed to load");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  async function update(slug: FlagSlug, patch: Partial<Pick<ServiceFlag, "enabled" | "mode">>) {
    if (savingSlug) return;
    const current = items.find((i) => i.slug === slug);
    if (!current) return;
    const nextBody = {
      enabled: patch.enabled ?? current.enabled,
      mode: patch.mode === undefined ? current.mode : patch.mode,
    };

    setSavingSlug(slug);
    setError("");
    setSuccess("");
    try {
      const res = await api.put<ServiceFlag>(`/admin/service-flags/${slug}`, nextBody);
      if (res.success && res.data) {
        setItems((prev) => prev.map((it) => (it.slug === slug ? { ...it, ...res.data! } : it)));
        setSuccess(`${COPY[slug].name} updated.`);
      } else {
        setError(res.error ?? "Failed to save");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingSlug(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-white">Service availability</h1>
        <p className="text-sm text-white/55 mt-1">
          Turn services on or off and choose how customers reach you for special services.
          Changes take effect within ~30 seconds.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((flag) => {
            const copy = COPY[flag.slug];
            const isSaving = savingSlug === flag.slug;
            const popupActive = flag.mode === "popup";
            return (
              <article
                key={flag.slug}
                className="rounded-xl p-5"
                style={cardStyle}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>
                      {copy.icon}
                    </span>
                    <div>
                      <h2 className="text-lg font-black text-white">{copy.name}</h2>
                      <p className="text-xs text-white/40">/{flag.slug}</p>
                    </div>
                  </div>

                  {/* Enabled toggle */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <span className="sr-only">{`Toggle ${copy.name}`}</span>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      aria-label={`Toggle ${copy.name}`}
                      checked={flag.enabled}
                      disabled={isSaving}
                      onChange={(e) => update(flag.slug, { enabled: e.target.checked })}
                    />
                    <span className="w-12 h-7 bg-white/20 rounded-full peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-6 after:w-6 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                  </label>
                </div>

                <p className="mt-4 text-sm text-white/55 leading-relaxed">{copy.description}</p>

                <div className="mt-5 flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
                      flag.enabled
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/8 text-white/40"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {flag.enabled ? "Available" : "Hidden from customers"}
                  </span>
                  {popupActive && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-400 px-2.5 py-1 font-medium">
                      📞 Phone only
                    </span>
                  )}
                </div>

                {copy.supportsPopup && (
                  <fieldset className="mt-5 border-t border-amber-900/20 pt-4">
                    <legend className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                      How customers book
                    </legend>
                    <div className="grid gap-2">
                      <label className="flex items-start gap-3 rounded-lg border border-amber-900/20 p-3 cursor-pointer hover:border-amber-900/40 hover:bg-white/3">
                        <input
                          type="radio"
                          name={`mode-${flag.slug}`}
                          className="mt-1"
                          checked={!popupActive}
                          disabled={isSaving}
                          onChange={() => update(flag.slug, { mode: null })}
                        />
                        <span className="text-sm">
                          <span className="font-medium text-white">Online booking</span>
                          <span className="block text-xs text-white/40">
                            Customer goes through the normal booking flow.
                          </span>
                        </span>
                      </label>
                      <label className="flex items-start gap-3 rounded-lg border border-amber-900/20 p-3 cursor-pointer hover:border-amber-900/40 hover:bg-white/3">
                        <input
                          type="radio"
                          name={`mode-${flag.slug}`}
                          className="mt-1"
                          checked={popupActive}
                          disabled={isSaving}
                          onChange={() => update(flag.slug, { mode: "popup" })}
                        />
                        <span className="text-sm">
                          <span className="font-medium text-white">
                            Show &ldquo;Please call us&rdquo; popup
                          </span>
                          <span className="block text-xs text-white/40">
                            Customer sees a phone / WhatsApp prompt instead of the
                            booking flow. Service stays visible.
                          </span>
                        </span>
                      </label>
                    </div>
                  </fieldset>
                )}

                {flag.updatedAt && (
                  <p className="mt-4 text-[11px] text-white/40">
                    Last updated {new Date(flag.updatedAt).toLocaleString("en-GB")}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
