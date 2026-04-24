"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

export function LocationToggle() {
  const [active, setActive] = useState(false);
  const watchId = useRef<number | null>(null);
  const lastSent = useRef(0);

  async function postLocation(lat: number, lng: number) {
    const token = sessionStorage.getItem("sv-auth-token");
    if (!token) return;
    try {
      await fetch(`${API_BASE}/driver/tracking/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
    } catch {}
  }

  useEffect(() => {
    if (active) {
      if (!("geolocation" in navigator)) return;
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const now = Date.now();
          if (now - lastSent.current >= 30000) {
            lastSent.current = now;
            postLocation(pos.coords.latitude, pos.coords.longitude);
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 20000 },
      );
    } else {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [active]);

  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        active
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
      {active ? "Sharing Location" : "Share Location"}
    </button>
  );
}
