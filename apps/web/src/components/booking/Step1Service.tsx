"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/services";
import { useBooking } from "@/lib/booking-store";
import { useServiceFlags, type ServiceFlagSlug } from "@/lib/service-flags";
import { ServiceImageCard } from "@/components/shared/ServiceImageCard";
import { getServiceImage } from "@/lib/service-images";
import { CallUsPopup } from "./CallUsPopup";

export function Step1Service() {
  const { state, dispatch } = useBooking();
  const { flags } = useServiceFlags();
  const [callPopup, setCallPopup] = useState<{ open: boolean; name: string }>({
    open: false,
    name: "",
  });

  const isFlagged = (slug: string): slug is ServiceFlagSlug =>
    slug === "rubbish-removal" || slug === "same-day-delivery";

  const visibleServices = SERVICES.filter((s) => {
    if (!isFlagged(s.slug)) return true;
    const flag = flags.get(s.slug);
    if (!flag) return true;
    // Hide entirely if disabled and not in popup mode.
    if (!flag.enabled && flag.mode !== "popup") return false;
    return true;
  });

  function choose(slug: string, name: string) {
    if (isFlagged(slug)) {
      const flag = flags.get(slug);
      if (flag && flag.mode === "popup") {
        setCallPopup({ open: true, name });
        return;
      }
    }
    dispatch({ type: "SET_SERVICE", slug, name });
    dispatch({ type: "SET_STEP", step: 2 });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">What do you need?</h1>
      <p className="text-slate-600 mb-6">Choose the service that best fits your move.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleServices.map((s) => {
          const flag = isFlagged(s.slug) ? flags.get(s.slug) : undefined;
          const popupOnly = flag?.mode === "popup";
          return (
            <div key={s.slug} className="relative">
              {popupOnly && (
                <span className="absolute top-2 left-2 z-20 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 shadow-sm">
                  Call us
                </span>
              )}
              <ServiceImageCard
                slug={s.slug}
                title={s.name}
                price={popupOnly ? "Phone booking" : `From £${s.startingFrom}`}
                imagePath={getServiceImage(s.slug)}
                isSelected={state.serviceSlug === s.slug}
                onClick={() => choose(s.slug, s.name)}
                variant="booking"
              />
            </div>
          );
        })}
      </div>

      <CallUsPopup
        open={callPopup.open}
        serviceName={callPopup.name}
        onClose={() => setCallPopup({ open: false, name: "" })}
      />
    </div>
  );
}
