import api from "../api";
import {
  deriveSessionStatus,
  isRejectedSession,
} from "../../features/calendar/services/calendar.service";
import type { TeacherSession } from "../../features/calendar/types/calendar.types";

export const getTeacherCalendar = async () => {
  const response = await api.get("/teacherSessions/GetMyRequests");
  return response.data;
};

function mapTeacherRequest(req: Record<string, unknown>): TeacherSession | null {
  const preferredDate = String(req.preferredDate ?? req.PreferredDate ?? "");
  if (!preferredDate) return null;

  const sessionId = req.sessionId ?? req.SessionId;
  if (sessionId == null) return null;

  const focusScore = req.focusScore ?? req.FocusScore;
  const duration = String(req.duration ?? req.Duration ?? "1 hour");

  return {
    id: Number(sessionId),
    date: preferredDate.split("T")[0],
    student: String(req.studentName ?? req.StudentName ?? "Assigned Student"),
    subject: String(req.subject ?? req.Subject ?? "Subject"),
    time: new Date(preferredDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    duration,
    status: deriveSessionStatus(req),
    focusScore: focusScore != null ? Number(focusScore) : undefined,
  };
}

export const getTeacherSessions = async (): Promise<TeacherSession[]> => {
  try {
    const data = await getTeacherCalendar();
    const requests = Array.isArray(data) ? data : [];

    return requests
      .filter((req) => !isRejectedSession(req))
      .map(mapTeacherRequest)
      .filter((session): session is TeacherSession => session !== null);
  } catch (err) {
    console.error("Failed to fetch teacher calendar", err);
    return [];
  }
};
