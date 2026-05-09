import type { UpcomingSession, RecentNote } from "../types/dashboard.types";

export const getUpcomingSessions = async (): Promise<UpcomingSession[]> => {
  return [
    {
      id: 1,
      teacher: "Dr. Sarah Johnson",
      subject: "Mathematics",
      time: "Today, 2:00 PM",
      duration: "1 hour",
      isCurrent: true,
    },
    {
      id: 2,
      teacher: "Prof. Michael Chen",
      subject: "Physics",
      time: "Tomorrow, 10:00 AM",
      duration: "1.5 hours",
      isCurrent: false,
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