import api from "../api";
import type { UpcomingSession, RecentNote } from "../../features/student-dashboard/types/dashboard.types";

export const getStudentDashboard = async () => {
  const response = await api.get("/StudentDashboard");
  return response.data;
};

// Backend returns: { success: true, data: { UpcomingSessions: [{TeacherName, SubjectName, ScheduledAt}], RecentSessions: [...], ... } }
export const getUpcomingSessions = async (): Promise<UpcomingSession[]> => {
  try {
    const res = await getStudentDashboard();
    const sessions = res?.data?.upcomingSessions ?? res?.data?.UpcomingSessions ?? [];
    return sessions.map((s: any, idx: number) => ({
      id: idx,
      teacher: s.teacherName ?? s.TeacherName ?? "Teacher",
      subject: s.subjectName ?? s.SubjectName ?? "Subject",
      time: s.scheduledAt ?? s.ScheduledAt
        ? new Date(s.scheduledAt ?? s.ScheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
        : "TBD",
      duration: "1 hour",
      isCurrent: false,
    }));
  } catch (error) {
    console.error("Failed to fetch student upcoming sessions", error);
    return [];
  }
};

// Backend's "RecentSessions" maps to the "RecentNotes" display (session history with focus score)
export const getRecentNotes = async (): Promise<RecentNote[]> => {
  try {
    const res = await getStudentDashboard();
    const sessions = res?.data?.recentSessions ?? res?.data?.RecentSessions ?? [];
    return sessions.map((s: any, idx: number) => ({
      id: idx,
      title: s.subjectName ?? s.SubjectName ?? "Session",
      subject: s.teacherName ?? s.TeacherName ?? "Teacher",
      date: s.scheduledAt ?? s.ScheduledAt
        ? new Date(s.scheduledAt ?? s.ScheduledAt).toLocaleDateString()
        : "N/A",
      focusScore: s.focusScore ?? s.FocusScore ?? 0,
    }));
  } catch (error) {
    console.error("Failed to fetch student recent sessions", error);
    return [];
  }
};
