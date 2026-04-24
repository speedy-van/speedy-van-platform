"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

interface Message {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

// ── Authenticated mode (admin, driver pages) ─────────────────────────────────
interface AuthedChatProps {
  mode: "authed";
  conversationId: string;
  currentUserId: string;
  token: string;
}

// ── Public mode (customer tracking page) ────────────────────────────────────
interface PublicChatProps {
  mode: "public";
  bookingRef: string;
  email: string;
}

type ChatWindowProps = (AuthedChatProps | PublicChatProps) & {
  title?: string;
};

export function ChatWindow(props: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      if (props.mode === "authed") {
        const res = await fetch(
          `${API_BASE}/chat/conversations/${props.conversationId}/messages?limit=100`,
          { headers: { Authorization: `Bearer ${props.token}` } },
        );
        const json = await res.json();
        if (json.success) setMessages(json.data.messages ?? []);
      } else {
        const res = await fetch(
          `${API_BASE}/chat/booking-messages/${encodeURIComponent(props.bookingRef)}?email=${encodeURIComponent(props.email)}`,
        );
        const json = await res.json();
        if (json.success) setMessages(json.data.messages ?? []);
      }
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [props]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void fetchMessages();
    // Poll every 10s for new messages
    const interval = setInterval(() => { void fetchMessages(); }, 10_000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend(text: string) {
    if (props.mode === "authed") {
      const res = await fetch(
        `${API_BASE}/chat/conversations/${props.conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify({ body: text }),
        },
      );
      const json = await res.json();
      if (json.success && json.data?.message) {
        setMessages((prev) => [...prev, json.data.message]);
        scrollToBottom();
      }
    } else {
      const res = await fetch(`${API_BASE}/chat/booking-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRef: props.bookingRef,
          email: props.email,
          content: text,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.message) {
        setMessages((prev) => [...prev, json.data.message]);
        scrollToBottom();
      }
    }
  }

  const currentUserId = props.mode === "authed" ? props.currentUserId : null;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-semibold text-slate-800">
          {props.title ?? "Chat with Support"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[240px] max-h-[400px]">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        {!loading && error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 italic">
            No messages yet. Start a conversation with our team.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            body={msg.body}
            createdAt={msg.createdAt}
            sender={msg.sender}
            isOwn={currentUserId ? msg.sender.id === currentUserId : msg.sender.role === "CUSTOMER"}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
