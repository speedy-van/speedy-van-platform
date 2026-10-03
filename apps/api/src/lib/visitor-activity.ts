export const VISITOR_ACTIVE_WINDOW_MS = 2 * 60 * 1000;
export const VISITOR_REPORTING_TIME_ZONE = "Europe/London";

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = dateTimeFormatters.get(timeZone);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  dateTimeFormatters.set(timeZone, formatter);
  return formatter;
}

function zonedParts(date: Date, timeZone = VISITOR_REPORTING_TIME_ZONE): DateParts {
  const values: Partial<Record<keyof DateParts, number>> = {};
  for (const part of formatterFor(timeZone).formatToParts(date)) {
    if (
      part.type === "year" ||
      part.type === "month" ||
      part.type === "day" ||
      part.type === "hour" ||
      part.type === "minute" ||
      part.type === "second"
    ) {
      values[part.type] = Number(part.value);
    }
  }

  return {
    year: values.year ?? date.getUTCFullYear(),
    month: values.month ?? date.getUTCMonth() + 1,
    day: values.day ?? date.getUTCDate(),
    hour: values.hour ?? 0,
    minute: values.minute ?? 0,
    second: values.second ?? 0,
  };
}

function offsetMsAt(utcDate: Date, timeZone = VISITOR_REPORTING_TIME_ZONE): number {
  const parts = zonedParts(utcDate, timeZone);
  const zonedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return zonedAsUtc - utcDate.getTime();
}

function startOfZonedDayFromParts(year: number, month: number, day: number, timeZone = VISITOR_REPORTING_TIME_ZONE): Date {
  const localMidnightAsUtc = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  const firstPass = new Date(localMidnightAsUtc - offsetMsAt(new Date(localMidnightAsUtc), timeZone));
  return new Date(localMidnightAsUtc - offsetMsAt(firstPass, timeZone));
}

function normalisedLocalDate(year: number, month: number, day: number): { year: number; month: number; day: number } {
  const normalized = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  return {
    year: normalized.getUTCFullYear(),
    month: normalized.getUTCMonth() + 1,
    day: normalized.getUTCDate(),
  };
}

function isoLocalDate(year: number, month: number, day: number): string {
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

export function activeVisitorCutoff(now = new Date()): Date {
  return new Date(now.getTime() - VISITOR_ACTIVE_WINDOW_MS);
}

export function activeVisitorWhere(now = new Date()) {
  return {
    isActive: true,
    lastActiveAt: { gte: activeVisitorCutoff(now) },
  };
}

export function heartbeatDurationIncrementSeconds(lastActiveAt: Date, now = new Date()): number {
  const seconds = Math.floor((now.getTime() - lastActiveAt.getTime()) / 1000);
  return Math.max(0, Math.min(seconds, 60));
}

export function shouldApplyExit(lastActiveAt: Date, exitSentAt: Date): boolean {
  return exitSentAt.getTime() >= lastActiveAt.getTime();
}

export function reportingDayRange(now = new Date(), offsetDays = 0, timeZone = VISITOR_REPORTING_TIME_ZONE) {
  const today = zonedParts(now, timeZone);
  const localDate = normalisedLocalDate(today.year, today.month, today.day + offsetDays);
  const nextDate = normalisedLocalDate(localDate.year, localDate.month, localDate.day + 1);

  return {
    label: isoLocalDate(localDate.year, localDate.month, localDate.day),
    start: startOfZonedDayFromParts(localDate.year, localDate.month, localDate.day, timeZone),
    end: startOfZonedDayFromParts(nextDate.year, nextDate.month, nextDate.day, timeZone),
    timeZone,
  };
}

export function recentReportingDayRanges(days: number, now = new Date(), timeZone = VISITOR_REPORTING_TIME_ZONE) {
  return Array.from({ length: days }, (_, index) => reportingDayRange(now, index - days + 1, timeZone));
}
