import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import type { TeacherSession } from "../types/calendar.types";
import { getSessionsForDate } from "../services/calendar.service";

interface Props {
  currentMonth: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  sessions: TeacherSession[];
  previousMonth: () => void;
  nextMonth: () => void;
}

export default function TeacherCalendarGrid({
  currentMonth,
  selectedDate,
  setSelectedDate,
  sessions,
  previousMonth,
  nextMonth,
}: Props) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: startingDayOfWeek });

  return (
    <Card className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-blue-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* DAYS HEADER */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">

        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          const daySessions = getSessionsForDate(date, sessions);

          const isSelected =
            selectedDate?.toDateString() === date.toDateString();

          const isToday =
            new Date().toDateString() === date.toDateString();

          const hasUpcoming = daySessions.some((s) => s.status === "upcoming");
          const hasCompleted = daySessions.some((s) => s.status === "completed");
          const hasPending = daySessions.some((s) => s.status === "pending");

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`aspect-square p-2 rounded-lg border transition ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isToday
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className="text-sm mb-1"
                style={{
                  color: isSelected || isToday ? "#1E3A8A" : "#000",
                }}
              >
                {day}
              </div>

              {daySessions.length > 0 && (
                <div className="flex flex-col gap-1">
                  {hasUpcoming && (
                    <div className="h-1 bg-blue-500 rounded" />
                  )}
                  {hasCompleted && (
                    <div className="h-1 bg-green-500 rounded" />
                  )}
                  {hasPending && (
                    <div className="h-1 bg-yellow-500 rounded" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* LEGEND (✔ CORRECT PLACE — FIX FROM FIGMA SPLIT) */}
      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Upcoming</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-sm text-gray-600">Pending</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-purple-500 rounded"></div>
          <span className="text-sm text-gray-600">Today</span>
        </div>

      </div>

    </Card>
  );
}