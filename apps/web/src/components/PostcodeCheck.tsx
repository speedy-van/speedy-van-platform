"use client";

import { useEffect, useMemo, useState } from "react";
import { UseMyLocationButton } from "./UseMyLocationButton";
import { OutOfAreaWaitlistPopup } from "./OutOfAreaWaitlistPopup";

const UK_POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i;
// All Scottish postcode areas
const SCOTLAND_PREFIXES = [
  "AB", "DD", "DG", "EH", "FK", "G", "HS", "IV",
  "KA", "KW", "KY", "ML", "PA", "PH", "TD", "ZE",
];

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "engagement", ...payload });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

function extractArea(postcode: string): string | null {
  const m = postcode.trim().toUpperCase().match(/^([A-Z]{1,2})/);
  return m ? m[1] : null;
}

export function PostcodeCheck() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const status = useMemo<
    | { kind: "idle" }
    | { kind: "invalid" }
    | { kind: "covered"; area: string }
    | { kind: "outside"; area: string }
  >(() => {
    const v = value.trim();
    if (!v) return { kind: "idle" };
    if (!UK_POSTCODE_RE.test(v)) return { kind: "invalid" };
    const area = extractArea(v);
    if (!area) return { kind: "invalid" };
    if (SCOTLAND_PREFIXES.includes(area)) return { kind: "covered", area };
    return { kind: "outside", area };
  }, [value]);

  // Fire one analytics event when a valid postcode produces a result
  useEffect(() => {
    if (status.kind === "covered") track("postcode_check", { result: "covered", area: status.area });
    else if (status.kind === "outside") track("postcode_check", { result: "outside", area: status.area });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.kind]);

  const showError = touched && status.kind === "invalid";

  return (
    <div className="hero-fade-up hero-fade-up-5 mt-5 max-w-md">
      <label htmlFor="postcode-check" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
        Check your postcode
      </label>
      <div className="flex gap-2">
        <input
          id="postcode-check"
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          spellCheck={false}
          maxLength={9}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          onBlur={() => setTouched(true)}
          placeholder="e.g. G1 1AA"
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-medium text-white placeholder-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent uppercase"
          aria-describedby="postcode-check-status"
        />
      </div>
      <div className="mt-1.5">
        <UseMyLocationButton
          variant="postcode"
          onResult={(r) => {
            if (r.postcode) {
              setValue(r.postcode.toUpperCase());
              setTouched(true);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-300 hover:text-primary-200 transition-colors"
        />
      </div>
      <p
        id="postcode-check-status"
        className="mt-1.5 text-xs min-h-[1rem]"
        aria-live="polite"
        role="status"
      >
        {status.kind === "covered" && (
          <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
            <span aria-hidden="true">✅</span> We cover {status.area} — book online for instant pricing.
          </span>
        )}
        {status.kind === "outside" && (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-amber-300 font-semibold">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">📞</span> {status.area} is outside our coverage —
            </span>
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="underline decoration-amber-200 underline-offset-2 hover:text-amber-200"
            >
              notify me when you launch here
            </button>
          </span>
        )}
        {showError && (
          <span className="text-red-300 font-medium">
            That doesn&apos;t look like a UK postcode.
          </span>
        )}
      </p>
      <OutOfAreaWaitlistPopup
        open={waitlistOpen && status.kind === "outside"}
        postcode={value.trim().toUpperCase()}
        area={status.kind === "outside" ? status.area : ""}
        source="postcode-check"
        onClose={() => setWaitlistOpen(false)}
      />
    </div>
  );
}
