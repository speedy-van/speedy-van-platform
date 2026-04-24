"use client";

interface Sender {
  id: string;
  name: string;
  role: string;
}

interface MessageBubbleProps {
  body: string;
  createdAt: string;
  sender: Sender;
  isOwn: boolean;
  isSystem?: boolean;
}

export function MessageBubble({ body, createdAt, sender, isOwn, isSystem }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <p className="text-xs italic text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {body}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-xs font-medium text-slate-500">
          {isOwn ? "You" : sender.name}
        </span>
        {sender.role === "ADMIN" && !isOwn && (
          <span className="text-[10px] bg-yellow-100 text-yellow-700 rounded px-1 font-semibold">
            Support
          </span>
        )}
        {sender.role === "DRIVER" && !isOwn && (
          <span className="text-[10px] bg-blue-100 text-blue-700 rounded px-1 font-semibold">
            Driver
          </span>
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? "bg-blue-500 text-white rounded-tr-sm"
            : "bg-slate-100 text-slate-900 rounded-tl-sm"
        }`}
      >
        {body}
      </div>
      <span className="text-[10px] text-slate-400 px-1">{time}</span>
    </div>
  );
}
