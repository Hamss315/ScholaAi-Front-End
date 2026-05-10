import { useState, useEffect } from "react";

import CalendarHeader from "../components/CalendarHeader";
import CalendarLegend from "../components/CalendarLegend";
import CalendarGrid from "../components/CalendarGrid";
import SessionSidebar from "../components/SessionSidebar";

import type { StudentSession } from "../types/calendar.types";
import { getStudentSessions } from "../../../services/api/studentCalendar";

export default function StudentCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<StudentSession[]>([]);

  useEffect(() => {
    getStudentSessions().then(setSessions);
  }, []);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedSessions =
    selectedDate
      ? sessions.filter(
          (s) => s.date === formatDateKey(selectedDate)
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