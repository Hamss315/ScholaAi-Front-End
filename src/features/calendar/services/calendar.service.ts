import type { SessionStatus, StudentSession } from "../types/calendar.types";

export const DEFAULT_SESSION_DURATION_MINUTES = 60;

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

export const getSessionsForDate = (
  date: Date,
  sessions: StudentSession[]
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
    const start = new Date(preferredDateStr);
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
