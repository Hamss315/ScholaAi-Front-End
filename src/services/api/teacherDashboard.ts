import api from "../api";
import type {
  ActiveSession,
  UpcomingClass,
  RecentSession,
} from "../../features/teacher-dashboard/types/dashboard.types";

export interface TodayOverview {
  sessionsToday: number;
  hoursTaught: number;
  avgFocusScore: number;
}

export interface TeacherDashboardOverview {
  teacherName: string;
  walletBalance: number;
  todayEarnings: number;
  thisMonthEarnings: number;
  avgRating: number;
  earningsSummary: {
    thisWeek: number;
    lastMonth: number;
  };
  activeSessions: ActiveSession[];
  upcomingClasses: UpcomingClass[];
  recentSessions: RecentSession[];
  todayOverview: TodayOverview;
  availableDays: number[];
}

export const getTeacherDashboard = async () => {
  const response = await api.get("/TeacherDashboard");
  return response.data;
};

export const getTeacherDashboardOverview = async (): Promise<TeacherDashboardOverview> => {
  try {
    const res = await getTeacherDashboard();
    const data = res?.data ?? res ?? {};

    const upcomingRaw = data?.upcomingSessions ?? data?.UpcomingSessions ?? [];
    const activeRaw   = data?.activeSessions  ?? data?.ActiveSessions  ?? [];
    const recentRaw   = data?.recentSessions  ?? data?.RecentSessions  ?? [];

    const upcomingClasses: UpcomingClass[] = upcomingRaw.map((s: any, idx: number) => ({
      id: s.requestId ?? s.RequestId ?? idx + 1,
      requestId: s.requestId ?? s.RequestId ?? idx + 1,
      studentName: s.studentName ?? s.StudentName ?? "Student",
      subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
      scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
    }));

    const activeSessions: ActiveSession[] = activeRaw.map((s: any, idx: number) => ({
      id: s.sessionId ?? s.SessionId ?? s.id ?? idx + 1,
      studentName: s.studentName ?? s.StudentName ?? "Student",
      subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
      scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
      studentFocusScore: s.studentFocusScore ?? s.StudentFocusScore,
    }));

    const recentSessions: RecentSession[] = recentRaw.map((s: any, idx: number) => ({
      id: s.id ?? idx + 1,
      studentName: s.studentName ?? s.StudentName ?? "Student",
      subjectName: s.subjectName ?? s.SubjectName ?? "Subject",
      scheduledAt: s.scheduledAt ?? s.ScheduledAt ?? "",
      studentFocusScore: s.studentFocusScore ?? s.StudentFocusScore ?? 0,
    }));

    const rawOverview = data?.todayOverview ?? data?.TodayOverview ?? {};

    return {
      teacherName: data?.teacherName ?? data?.TeacherName ?? "Teacher",
      walletBalance: Number(data?.walletBalance ?? data?.WalletBalance ?? 0),
      todayEarnings: Number(data?.todayEarnings ?? 0),
      thisMonthEarnings: Number(data?.thisMonthEarnings ?? 0),
      avgRating: Number(data?.avgRating ?? 0),
      earningsSummary: {
        thisWeek: Number(data?.earningsSummary?.thisWeek ?? 0),
        lastMonth: Number(data?.earningsSummary?.lastMonth ?? 0),
      },
      activeSessions,
      upcomingClasses,
      recentSessions,
      availableDays: data?.availableDays ?? data?.AvailableDays ?? [],
      todayOverview: {
        sessionsToday: Number(rawOverview?.sessionsToday ?? rawOverview?.SessionsToday ?? 0),
        hoursTaught: Number(rawOverview?.hoursTaught ?? rawOverview?.HoursTaught ?? 0),
        avgFocusScore: Number(rawOverview?.avgFocusScore ?? rawOverview?.AvgFocusScore ?? 0),
      },
    };
  } catch (error) {
    console.error("Failed to fetch teacher dashboard", error);
    return {
      teacherName: "Teacher",
      walletBalance: 0,
      todayEarnings: 0,
      thisMonthEarnings: 0,
      avgRating: 0,
      earningsSummary: { thisWeek: 0, lastMonth: 0 },
      activeSessions: [],
      upcomingClasses: [],
      recentSessions: [],
      availableDays: [],
      todayOverview: { sessionsToday: 0, hoursTaught: 0, avgFocusScore: 0 },
    };
  }
};

export const endSession = async (sessionId: number | string): Promise<void> => {
  try {
    await api.post(`/Session/${sessionId}/end`);
  } catch (error) {
    console.error("Failed to end session", error);
    throw error;
  }
};

// Backward-compat helpers
export const getActiveSessions = async () => {
  const overview = await getTeacherDashboardOverview();
  return overview.activeSessions;
};

export const getUpcomingClasses = async () => {
  const overview = await getTeacherDashboardOverview();
  return overview.upcomingClasses;
};

export const getTeacherSummary = async () => {
  const overview = await getTeacherDashboardOverview();
  return {
    teacherName: overview.teacherName,
    todayEarnings: overview.todayEarnings,
    thisMonthEarnings: overview.thisMonthEarnings,
    avgRating: overview.avgRating,
    thisWeekEarnings: overview.earningsSummary.thisWeek,
    lastMonthEarnings: overview.earningsSummary.lastMonth,
    recentSessions: overview.recentSessions,
    upcomingClasses: overview.upcomingClasses,
  };
};
