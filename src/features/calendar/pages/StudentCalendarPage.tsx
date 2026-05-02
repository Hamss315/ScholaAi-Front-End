import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CalendarHeader from "../components/CalendarHeader";
import CalendarLegend from "../components/CalendarLegend";
import CalendarGrid from "../components/CalendarGrid";
import SessionSidebar from "../components/SessionSidebar";

import type { StudentSession } from "../types/calendar.types";

export default function StudentCalendarPage() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const sessions: StudentSession[] = [
    { id: 1, date: "2025-10-28", teacher: "Dr. Sarah Johnson", subject: "Mathematics", time: "2:00 PM", duration: "1 hour", status: "completed", focusScore: 92 },
    { id: 2, date: "2025-10-29", teacher: "Prof. Michael Chen", subject: "Physics", time: "10:00 AM", duration: "1.5 hours", status: "upcoming" },
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const selectedSessions =
    selectedDate
      ? sessions.filter(
          (s) => s.date === selectedDate.toISOString().split("T")[0]
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-50">

      <CalendarHeader />

      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            Session Calendar
          </h1>
          <p className="text-gray-600">
            View and manage all your learning sessions
          </p>
        </div>

        <CalendarLegend />

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <CalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              sessions={sessions}
              previousMonth={previousMonth}
              nextMonth={nextMonth}
            />
          </div>

          <SessionSidebar
            selectedDate={selectedDate}
            sessions={selectedSessions}
            allSessions={sessions}
            currentMonth={currentMonth}
          />

        </div>
      </div>
    </div>
  );
}