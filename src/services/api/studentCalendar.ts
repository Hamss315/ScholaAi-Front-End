import api from "../api";
import { getStudentSessions as fetchStudentSessionsList } from "./studentSessions";
import {
  deriveSessionStatus,
  dedupeSessionRecords,
  formatSessionTime,
  getScheduledAt,
  getSessionId,
  isRejectedSession,
  toLocalDateKey,
} from "../../features/calendar/services/calendar.service";
import type { StudentSession } from "../../features/calendar/types/calendar.types";

export const getStudentCalendar = async () => {
  const response = await api.get("/studentSessions/GetMyRequests");
  return response.data;
};

function mapStudentRequest(req: Record<string, unknown>): StudentSession | null {
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
    teacher: String(
      req.teacherName ??
        req.TeacherName ??
        req.teacher ??
        req.Teacher ??
        "Assigned Teacher"
    ),
    subject: String(
      req.subject ??
        req.Subject ??
        req.lessonTitle ??
        req.LessonTitle ??
        req.subjectName ??
        req.SubjectName ??
        "Subject"
    ),
    time: formatSessionTime(scheduledAt),
    duration,
    status: deriveSessionStatus(req),
    focusScore: focusScore != null ? Number(focusScore) : undefined,
  };
}

export const getStudentSessions = async (): Promise<StudentSession[]> => {
  try {
    const [requestsData, sessionsData] = await Promise.all([
      getStudentCalendar().catch(() => []),
      fetchStudentSessionsList().catch(() => []),
    ]);

    const requests = Array.isArray(requestsData) ? requestsData : [];
    const sessions = Array.isArray(sessionsData) ? sessionsData : [];
    const combined = [...requests, ...sessions];

    return dedupeSessionRecords(combined)
      .filter((req) => !isRejectedSession(req))
      .map(mapStudentRequest)
      .filter((session): session is StudentSession => session !== null);
  } catch (err) {
    console.error("Failed to fetch student calendar", err);
    return [];
  }
};
