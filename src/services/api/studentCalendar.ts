import api from "../api";
import { deriveSessionStatus, isRejectedSession } from "../../features/calendar/services/calendar.service";
import type { StudentSession } from "../../features/calendar/types/calendar.types";

export const getStudentCalendar = async () => {
  const response = await api.get("/studentSessions/GetMyRequests");
  return response.data;
};

function mapStudentRequest(req: Record<string, unknown>): StudentSession | null {
  const preferredDate = String(req.preferredDate ?? req.PreferredDate ?? "");
  if (!preferredDate) return null;

  const sessionId = req.sessionId ?? req.SessionId;
  if (sessionId == null) return null;

  const focusScore = req.focusScore ?? req.FocusScore;
  const duration = String(req.duration ?? req.Duration ?? "1 hour");

  return {
    id: Number(sessionId),
    date: preferredDate.split("T")[0],
    teacher: String(req.teacherName ?? req.TeacherName ?? "Assigned Teacher"),
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

export const getStudentSessions = async (): Promise<StudentSession[]> => {
  try {
    const data = await getStudentCalendar();
    const requests = Array.isArray(data) ? data : [];

    return requests
      .filter((req) => !isRejectedSession(req))
      .map(mapStudentRequest)
      .filter((session): session is StudentSession => session !== null);
  } catch (err) {
    console.error("Failed to fetch student calendar", err);
    return [];
  }
};
