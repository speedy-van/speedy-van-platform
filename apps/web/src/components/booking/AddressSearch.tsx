"use client";

import { useState, useRef, useEffect } from "react";
import type { AddressResult } from "@/lib/booking-store";

interface AddressSearchProps {
  label: string;
  value: AddressResult | null;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
}

interface GeoFeature {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

export function AddressSearch({ label, value, onSelect, placeholder }: AddressSearchProps) {
  const [query, setQuery] = useState(value?.address || "");
  const [results, setResults] = useState<GeoFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  function handleChange(val: string) {
    setQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (val.length < 3) { setResults([]); setOpen(false); return; }
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/geocode/search?q=${encodeURIComponent(val)}`);
        const json = await res.json();
        if (json.success && json.data?.results) {
          setResults(json.data.results);
          setOpen(true);
        }
      } catch {
        // Graceful – no geocoding available
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(r: GeoFeature) {
    setQuery(r.address);
    setResults([]);
    setOpen(false);
    onSelect(r);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || "Start typing an address…"}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
          </div>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 block truncate">{r.address}</span>
                {r.postcode && (
                  <span className="text-xs text-slate-500">{r.postcode}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
