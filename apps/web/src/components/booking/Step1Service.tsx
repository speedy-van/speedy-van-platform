"use client";

import { SERVICES } from "@/lib/services";
import { useBooking } from "@/lib/booking-store";

export function Step1Service() {
  const { dispatch } = useBooking();

  function choose(slug: string, name: string) {
    dispatch({ type: "SET_SERVICE", slug, name });
    dispatch({ type: "SET_STEP", step: 2 });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">What do you need?</h1>
      <p className="text-slate-600 mb-6">Choose the service that best fits your move.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SERVICES.map((s) => (
          <button
            key={s.slug}
            onClick={() => choose(s.slug, s.name)}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left hover:border-primary-400 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <span className="text-4xl" role="img" aria-hidden>
              {s.icon}
            </span>
            <div className="text-center">
              <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">from £{s.startingFrom}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
