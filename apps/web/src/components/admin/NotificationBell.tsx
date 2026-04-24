"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  icon?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevUnread = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.isRead).length;

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {
        // Fallback: Web Audio API beep
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
        } catch {}
      });
    } catch {}
  }, [soundEnabled]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<{ items: Notification[] }>("/admin/notifications");
      if (res.success && res.data) {
        const newUnread = res.data.items.filter((n) => !n.isRead).length;
        if (newUnread > prevUnread.current) playSound();
        prevUnread.current = newUnread;
        setItems(res.data.items);
      }
    } catch {}
  }, [playSound]);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  async function markAllRead() {
    try {
      await api.post("/admin/notifications/read", { all: true });
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      prevUnread.current = 0;
    } catch {}
  }

  async function markRead(id: string) {
    try {
      await api.patch(`/admin/notifications/${id}`, { isRead: true });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {}
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 ${unread > 0 ? "animate-[wiggle_3s_ease-in-out_infinite]" : ""}`}
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Notifications ({unread})</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                className="text-slate-400 hover:text-slate-600 text-sm"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500 text-center">No notifications</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${!n.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5">{n.icon ?? "🔔"}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
