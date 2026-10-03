const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP"
});

const eventDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short"
});

const scheduleDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export function formatMoney(value: number | null | undefined, fallback = "Not recorded"): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return gbpFormatter.format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "Date TBC";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function formatDateTime(value: string | null | undefined, fallback = "Time TBC"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || fallback;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatLondonDateTime(value: string | null | undefined, fallback = "Not recorded"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return `${eventDateTimeFormatter.format(date)} UK time`;
}

export function formatScheduleDate(value: string | null | undefined, fallback = "Date TBC"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return scheduleDateFormatter.format(date);
}

export function compactDateLabel(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 5);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit"
  }).format(date);
}
