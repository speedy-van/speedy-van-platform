"use client";

import { useState, useRef, useEffect, useId } from "react";
import type { AddressResult } from "@/lib/booking-store";
import { getLocationUnavailableMessage } from "@/lib/api-base";
import { reverseGeocode, searchAddresses } from "@/lib/geocode-client";

interface AddressSearchProps {
  label: string;
  value: AddressResult | null;
  onSelect: (result: AddressResult) => void;
  onClear?: () => void;
  placeholder?: string;
}

interface GeoFeature {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

export function AddressSearch({ label, value, onSelect, onClear, placeholder }: AddressSearchProps) {
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState(value?.address || "");
  const [results, setResults] = useState<GeoFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestSeq = useRef(0);

  useEffect(() => () => {
    requestSeq.current += 1;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (value) setQuery(value.address);
  }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function runSearch(val: string) {
    const requestId = requestSeq.current + 1;
    requestSeq.current = requestId;
    setLoading(true);
    setSearchError("");
    try {
      const nextResults = await searchAddresses(val);
      if (requestId !== requestSeq.current) return;
      setResults(nextResults);
      setOpen(true);
    } catch {
      if (requestId !== requestSeq.current) return;
      setResults([]);
      setOpen(true);
      setSearchError("Address search is unavailable. Please retry.");
    } finally {
      if (requestId === requestSeq.current) setLoading(false);
    }
  }

  function handleChange(val: string) {
    requestSeq.current += 1;
    setLoading(false);
    setLocating(false);
    setQuery(val);
    setSearchError("");
    setLocError(null);
    setResults([]);
    setOpen(false);
    if (value && val !== value.address) onClear?.();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (val.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    timeoutRef.current = setTimeout(() => void runSearch(val.trim()), 300);
  }

  function handleSelect(r: GeoFeature) {
    requestSeq.current += 1;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setLocating(false);
    setQuery(r.address);
    setResults([]);
    setOpen(false);
    setSearchError("");
    onSelect(r);
  }

  function handleUseMyLocation() {
    const unavailableMessage = getLocationUnavailableMessage();
    if (unavailableMessage) {
      setLocError(unavailableMessage);
      return;
    }
    setLocating(true);
    setLocError(null);
    requestSeq.current += 1;
    const requestId = requestSeq.current;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setOpen(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const result = await reverseGeocode(lat, lng);
          if (requestId !== requestSeq.current) return;
          setQuery(result.address);
          onSelect(result);
        } catch {
          if (requestId !== requestSeq.current) return;
          setLocError("Failed to fetch your address. Please try again.");
        } finally {
          if (requestId === requestSeq.current) setLocating(false);
        }
      },
      (err) => {
        if (requestId !== requestSeq.current) return;
        setLocating(false);
        if (err.code === 1) {
          setLocError("Location access was denied. Allow location for this site, then try again.");
        } else if (err.code === 3) {
          setLocError("Location lookup timed out. Please try again or type your address.");
        } else {
          setLocError("Couldn't get your location. Please type your address.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || "Start typing an address…"}
          className="min-h-12 w-full rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
          style={{ background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-describedby={`${inputId}-state`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        )}
      </div>
      <p id={`${inputId}-state`} className="mt-1.5 text-xs text-amber-400/60" aria-live="polite">
        {value && query === value.address
          ? `Confirmed address${value.postcode ? `: ${value.postcode}` : ""}`
          : query.trim().length > 0
            ? "Choose a suggestion to confirm this address."
            : "Start typing, then choose a matching address."}
      </p>
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={locating}
        className="mt-2 flex min-h-9 items-center gap-1.5 text-xs font-semibold text-amber-400/70 transition-colors hover:text-amber-300 disabled:opacity-50"
      >
        {locating ? (
          <>
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <span>Getting your location…</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Use my current location</span>
          </>
        )}
      </button>
      {locError && (
        <p className="text-xs text-red-400 mt-1">{locError}</p>
      )}
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl shadow-2xl" style={{ background: "#1A1200", boxShadow: "0 0 0 1px rgba(245,158,11,0.20), 0 16px 48px rgba(0,0,0,0.7)" }}>
          {results.length > 0 ? (
            <ul id={listId} role="listbox">
              {results.map((r, i) => (
                <li key={`${r.address}-${i}`} role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-amber-500/10 focus:bg-amber-500/10 focus:outline-none"
                  >
                    <span className="block truncate font-medium text-white">{r.address}</span>
                    {r.postcode && (
                      <span className="text-xs text-amber-400/60">{r.postcode}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm" aria-live="polite">
              <p className="font-semibold text-white/70">
                {loading ? "Searching addresses…" : searchError || "No addresses found."}
              </p>
              {!loading && (
                <button
                  type="button"
                  onClick={() => void runSearch(query.trim())}
                  disabled={query.trim().length < 3}
                  className="mt-3 min-h-10 rounded-lg bg-amber-500/20 px-4 text-xs font-bold text-amber-400 ring-1 ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Retry search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
