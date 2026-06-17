import api from "../api";

export interface TeacherDashboardOverview {
  teacherName: string;
  todayEarnings: number;
  thisMonthEarnings: number;
  avgRating: number;
  earningsSummary: {
    thisWeek: number;
    lastMonth: number;
  };
  activeSessions: Array<{
    id: number;
    student: string;
    subject: string;
    startTime: string;
    focusScore: number;
    status: "good" | "warning";
    isCurrent: boolean;
  }>;
  upcomingClasses: Array<{
    id: number;
    student: string;
    subject: string;
    time: string;
    duration: string;
    scheduledAt: string;
  }>;
  recentSessions: Array<{
    id: number;
    student: string;
    subject: string;
    scheduledAt: string;
    focusScore: number;
  }>;
}

export const getTeacherDashboard = async () => {
  const response = await api.get("/TeacherDashboard");
  return response.data;
};

export const getTeacherDashboardOverview = async (): Promise<TeacherDashboardOverview> => {
  try {
    const res = await getTeacherDashboard();
    const data = res?.data ?? res ?? {};

    const upcoming = data?.upcomingSessions ?? data?.UpcomingSessions ?? [];
    const recent = data?.recentSessions ?? data?.RecentSessions ?? [];

    const upcomingClasses = upcoming.map((s: any, idx: number) => {
      const scheduledAt = s?.scheduledAt ?? s?.ScheduledAt ?? null;
      const parsed = scheduledAt ? new Date(scheduledAt) : null;
      return {
        id: idx + 1,
        student: s?.studentName ?? s?.StudentName ?? "Student",
        subject: s?.subjectName ?? s?.SubjectName ?? "Subject",
        time: parsed
          ? parsed.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
          : "TBD",
        duration: "1 hour",
        scheduledAt: parsed ? parsed.toISOString() : "",
      };
    });

    const recentSessions = recent.map((s: any, idx: number) => ({
      id: idx + 1,
      student: s?.studentName ?? s?.StudentName ?? "Student",
      subject: s?.subjectName ?? s?.SubjectName ?? "Subject",
      scheduledAt: s?.scheduledAt ?? s?.ScheduledAt ?? "",
      focusScore: s?.studentFocusScore ?? s?.StudentFocusScore ?? 0,
    }));

    return {
      teacherName: data?.teacherName ?? data?.TeacherName ?? "Teacher",
      todayEarnings: Number(data?.todayEarnings ?? data?.TodayEarnings ?? 0),
      thisMonthEarnings: Number(data?.thisMonthEarnings ?? data?.ThisMonthEarnings ?? 0),
      avgRating: Number(data?.avgRating ?? data?.AvgRating ?? 0),
      earningsSummary: {
        thisWeek: Number(data?.earningsSummary?.thisWeek ?? data?.EarningsSummary?.ThisWeek ?? 0),
        lastMonth: Number(data?.earningsSummary?.lastMonth ?? data?.EarningsSummary?.LastMonth ?? 0),
      },
      activeSessions: [],
      upcomingClasses,
      recentSessions,
    };
  } catch (error) {
    console.error("Failed to fetch teacher dashboard", error);
    return {
      teacherName: "Teacher",
      todayEarnings: 0,
      thisMonthEarnings: 0,
      avgRating: 0,
      earningsSummary: { thisWeek: 0, lastMonth: 0 },
      activeSessions: [],
      upcomingClasses: [],
      recentSessions: [],
    };
  }
};

// Backward-compatible helpers for current component usage.
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
