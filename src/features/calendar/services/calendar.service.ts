import type { SessionStatus } from "../types/calendar.types";
import { parseUTCDate } from "../../../utils/utils";

export const DEFAULT_SESSION_DURATION_MINUTES = 60;

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Parse YYYY-MM-DD as local calendar date (avoids UTC midnight shift). */
export function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Map API datetime to the local calendar day shown in the grid. */
export function toLocalDateKey(dateStr: string): string {
  if (!dateStr) return "";

  const dateOnly = dateStr.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnly) {
    return formatDateKey(parseLocalDateKey(dateOnly[1]));
  }

  const parsed = parseUTCDate(dateStr);
  if (!isNaN(parsed.getTime())) {
    return formatDateKey(parsed);
  }

  const fallback = dateStr.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(fallback)) {
    return formatDateKey(parseLocalDateKey(fallback));
  }

  return "";
}

export function isSameLocalMonth(dateKey: string, month: Date): boolean {
  const d = parseLocalDateKey(dateKey);
  return (
    d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
  );
}

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    daysInMonth: lastDay.getDate(),
    startingDayOfWeek: firstDay.getDay(),
  };
};

export const getSessionsForDate = <T extends { date: string }>(
  date: Date,
  sessions: T[]
) => {
  const dateString = formatDateKey(date);
  return sessions.filter((s) => s.date === dateString);
};

export function parseDurationMinutes(duration?: string | number | null): number {
  if (typeof duration === "number" && duration > 0) return duration;
  if (!duration) return DEFAULT_SESSION_DURATION_MINUTES;

  const str = String(duration).toLowerCase();
  const hourMatch = str.match(/(\d+(?:\.\d+)?)\s*h/);
  const minMatch = str.match(/(\d+)\s*m/);

  if (hourMatch) return Math.round(parseFloat(hourMatch[1]) * 60);
  if (minMatch) return parseInt(minMatch[1], 10);

  const asNum = parseInt(str, 10);
  return asNum > 0 ? asNum : DEFAULT_SESSION_DURATION_MINUTES;
}

export function isRejectedSession(req: Record<string, unknown>): boolean {
  const rawStatus = String(req.status ?? req.Status ?? "").toLowerCase();

  return (
    req.isRejected === true ||
    req.IsRejected === true ||
    rawStatus === "rejected" ||
    rawStatus === "declined"
  );
}

export function deriveSessionStatus(
  req: Record<string, unknown>,
  now: Date = new Date()
): SessionStatus {
  const rawStatus = String(req.status ?? req.Status ?? "").toLowerCase();

  const isAccepted =
    req.isAccepted === true ||
    req.IsAccepted === true ||
    rawStatus === "accepted" ||
    rawStatus === "completed" ||
    rawStatus === "ended";

  const focusScore = req.focusScore ?? req.FocusScore;

  const hasEnded =
    req.isCompleted === true ||
    req.IsCompleted === true ||
    req.isEnded === true ||
    req.IsEnded === true ||
    rawStatus === "completed" ||
    rawStatus === "ended" ||
    focusScore != null;

  if (hasEnded) {
    return "completed";
  }

  if (!isAccepted) {
    return "pending";
  }

  const preferredDateStr = String(
    req.preferredDate ?? req.PreferredDate ?? req.scheduledAt ?? req.ScheduledAt ?? ""
  );

  if (preferredDateStr) {
    const start = parseUTCDate(preferredDateStr);
    if (!isNaN(start.getTime())) {
      const durationMinutes = parseDurationMinutes(
        (req.duration ?? req.Duration) as string | number | undefined
      );
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      if (end <= now) {
        return "completed";
      }

      return "upcoming";
    }
  }

  return "upcoming";
}

export function getScheduledAt(req: Record<string, unknown>): string {
  return String(
    req.preferredDate ?? req.PreferredDate ?? req.scheduledAt ?? req.ScheduledAt ?? req.date ?? req.Date ?? ""
  );
}

export function getSessionId(req: Record<string, unknown>): number | null {
  const id = req.sessionId ?? req.SessionId ?? req.id ?? req.Id;
  if (id == null) return null;
  const num = Number(id);
  return Number.isNaN(num) ? null : num;
}

export function dedupeSessionRecords(
  records: Record<string, unknown>[]
): Record<string, unknown>[] {
  const byId = new Map<number, Record<string, unknown>>();

  for (const req of records) {
    const id = getSessionId(req);
    if (id == null) continue;

    const existing = byId.get(id);
    byId.set(id, existing ? { ...existing, ...req } : req);
  }

  return Array.from(byId.values());
}

export function formatSessionTime(scheduledAt: string): string {
  if (!scheduledAt) return "--:--";
  const parsed = parseUTCDate(scheduledAt);
  if (isNaN(parsed.getTime())) return "--:--";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
