"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

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
          ? "text-emerald-400"
          : "text-white/55"
      }`}
      style={active
        ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }
        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
      }
    >
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`} />
      {active ? "Sharing Location" : "Share Location"}
    </button>
  );
}
