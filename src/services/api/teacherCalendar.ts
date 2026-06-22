import api from "../api";
import {
  deriveSessionStatus,
  dedupeSessionRecords,
  formatSessionTime,
  getScheduledAt,
  getSessionId,
  isRejectedSession,
  toLocalDateKey,
} from "../../features/calendar/services/calendar.service";
import type { TeacherSession } from "../../features/calendar/types/calendar.types";

export const getTeacherCalendar = async () => {
  const response = await api.get("/teacherSessions/GetMyRequests");
  return response.data;
};

function mapTeacherRequest(req: Record<string, unknown>): TeacherSession | null {
  const scheduledAt = getScheduledAt(req);
  if (!scheduledAt) return null;

  const sessionId = getSessionId(req);
  if (sessionId == null) return null;

  const dateKey = toLocalDateKey(scheduledAt);
  if (!dateKey) return null;

  const focusScore = req.focusScore ?? req.FocusScore;
  const duration = String(req.duration ?? req.Duration ?? "1 hour");

  return {
    id: sessionId,
    date: dateKey,
    student: String(req.studentName ?? req.StudentName ?? "Assigned Student"),
    subject: String(req.subject ?? req.Subject ?? "Subject"),
    time: formatSessionTime(scheduledAt),
    duration,
    status: deriveSessionStatus(req),
    focusScore: focusScore != null ? Number(focusScore) : undefined,
  };
}

export const getTeacherSessions = async (): Promise<TeacherSession[]> => {
  try {
    const data = await getTeacherCalendar();
    const requests = Array.isArray(data) ? data : [];

    return dedupeSessionRecords(requests)
      .filter((req) => !isRejectedSession(req))
      .map(mapTeacherRequest)
      .filter((session): session is TeacherSession => session !== null);
  } catch (err) {
    console.error("Failed to fetch teacher calendar", err);
    return [];
  }
};
