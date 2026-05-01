import type { StudentSession } from "../types/calendar.types";

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    daysInMonth: lastDay.getDate(),
    startingDayOfWeek: firstDay.getDay(),
  };
};

export const getSessionsForDate = (
  date: Date,
  sessions: StudentSession[]
) => {
  const dateString = date.toISOString().split("T")[0];
  return sessions.filter((s) => s.date === dateString);
};