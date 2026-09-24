"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DriverTopBar } from "@/components/driver/DriverTopBar";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

interface Conversation {
  id: string;
  booking: { id: string; reference: string; serviceName: string; status: string };
  messages: { body: string; createdAt: string }[];
}

export default function DriverMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("sv-auth-token");
    if (!token) { setLoading(false); return; }
    fetch(`${API_BASE}/chat/conversations`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setConversations(json.data?.conversations ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <DriverTopBar title="Messages" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        )}
        {!loading && conversations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-lg font-black text-white">No conversations yet</p>
            <p className="text-sm text-white/55 mt-2">Messages from admin and customers will appear here.</p>
          </div>
        )}
        {!loading && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const last = conv.messages[0];
              return (
                <Link
                  key={conv.id}
                  href={`/driver/my-jobs/${conv.booking.id}`}
                  className="block rounded-2xl p-4 transition"
                  style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 4px 16px rgba(0,0,0,0.4)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{conv.booking.reference}</p>
                      <p className="text-xs text-white/55 truncate">{conv.booking.serviceName}</p>
                    </div>
                    <span className="text-xs text-white/40 shrink-0">
                      {last ? new Date(last.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                    </span>
                  </div>
                  {last && (
                    <p className="text-xs text-white/55 mt-2 truncate">{last.body}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
