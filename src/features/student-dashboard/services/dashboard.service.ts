import type { UpcomingSession, RecentNote } from "../types/dashboard.types";

// Legacy mock service — kept for backward compat, not used by the main dashboard page
export const getUpcomingSessions = async (): Promise<UpcomingSession[]> => {
  return [
    {
      id: 1,
      teacherName: "Dr. Sarah Johnson",
      subjectName: "Mathematics",
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    },
    {
      id: 2,
      teacherName: "Prof. Michael Chen",
      subjectName: "Physics",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    },
  ];
};

export const getRecentNotes = async (): Promise<RecentNote[]> => {
  return [
    {
      id: 1,
      title: "Quadratic Equations - Session Summary",
      subject: "Mathematics",
      date: "Oct 27, 2025",
      focusScore: 92,
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      date: "Oct 25, 2025",
      focusScore: 88,
    },
  ];
};