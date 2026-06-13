import api from "../api";
import type {
  UpcomingSession,
  ActiveSession,
  RecentSession,
  RecentNote,
} from "../../features/student-dashboard/types/dashboard.types";

export const getStudentDashboard = async () => {
  const response = await api.get("/StudentDashboard");
  return response.data;
};

export interface WeeklyEngagement {
  day: string;
  avgFocusScore: number;
}

export interface WalletSummary {
  lastRechargeAmount: number;
  lastRechargeDate: string | null;
  lastSessionAmount: number;
  lastSessionDate: string | null;
}

export interface StudentDashboardData {
  studentName: string;
  avgFocusScore: number;
  sessionsThisMonth: number;
  walletBalance: number;
  upcomingSessions: UpcomingSession[];
  activeSessions: ActiveSession[];
  recentSessions: RecentSession[];
  weeklyEngagement: WeeklyEngagement[];
  walletSummary: WalletSummary;
}

export const getStudentDashboardData = async (): Promise<StudentDashboardData> => {
  try {
    const res = await getStudentDashboard();
    const data = res?.data ?? {};

    const mapUpcoming = (arr: any[]): UpcomingSession[] =>
      arr.map((s: any, idx: number) => ({
        id: s.id ?? idx,
        teacherName: s.teacherName ?? s.TeacherName ?? "Teacher",
        subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
        scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
      }));

    const mapActive = (arr: any[]): ActiveSession[] =>
      arr.map((s: any, idx: number) => ({
        id: s.sessionId ?? s.SessionId ?? s.id ?? idx,
        teacherName: s.teacherName ?? s.TeacherName ?? "Teacher",
        subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
        scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
        focusScore: s.focusScore ?? s.FocusScore,
      }));

    const mapRecent = (arr: any[]): RecentSession[] =>
      arr.map((s: any, idx: number) => ({
        id: s.id ?? idx,
        teacherName: s.teacherName ?? s.TeacherName ?? "Teacher",
        subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
        scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
        focusScore: s.focusScore ?? s.FocusScore ?? 0,
      }));

    return {
      studentName: data.studentName ?? data.StudentName ?? "Student",
      avgFocusScore: Number(data.avgFocusScore ?? 0),
      sessionsThisMonth: Number(data.sessionsThisMonth ?? 0),
      walletBalance: Number(data.walletBalance ?? 0),
      upcomingSessions: mapUpcoming(data.upcomingSessions ?? data.UpcomingSessions ?? []),
      activeSessions: mapActive(data.activeSessions ?? data.ActiveSessions ?? []),
      recentSessions: mapRecent(data.recentSessions ?? data.RecentSessions ?? []),
      weeklyEngagement: (data.weeklyEngagement ?? data.WeeklyEngagement ?? []).map((we: any) => ({
        day: we.day ?? we.Day ?? "",
        avgFocusScore: Number(we.avgFocusScore ?? we.AvgFocusScore ?? 0),
      })),
      walletSummary: {
        lastRechargeAmount: Number(data.walletSummary?.lastRechargeAmount ?? data.walletSummary?.LastRechargeAmount ?? 0),
        lastRechargeDate: data.walletSummary?.lastRechargeDate ?? data.walletSummary?.LastRechargeDate ?? null,
        lastSessionAmount: Number(data.walletSummary?.lastSessionAmount ?? data.walletSummary?.LastSessionAmount ?? 0),
        lastSessionDate: data.walletSummary?.lastSessionDate ?? data.walletSummary?.LastSessionDate ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch student dashboard", error);
    return {
      studentName: "Student",
      avgFocusScore: 0,
      sessionsThisMonth: 0,
      walletBalance: 0,
      upcomingSessions: [],
      activeSessions: [],
      recentSessions: [],
      weeklyEngagement: [],
      walletSummary: {
        lastRechargeAmount: 0,
        lastRechargeDate: null,
        lastSessionAmount: 0,
        lastSessionDate: null,
      },
    };
  }
};

// --- Backward-compat helpers (used by old components) ---

export const getUpcomingSessions = async (): Promise<UpcomingSession[]> => {
  const d = await getStudentDashboardData();
  return d.upcomingSessions;
};

export const getRecentNotes = async (): Promise<RecentNote[]> => {
  const d = await getStudentDashboardData();
  return d.recentSessions.map((s) => ({
    id: s.id,
    title: s.subjectName,
    subject: s.teacherName,
    date: s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : "N/A",
    focusScore: s.focusScore,
  }));
};
