import { useState } from "react";
import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import TeacherCalendarGrid from "../components/TeacherCalendarGrid";
import TeacherSidebar from "../components/TeacherSidebar";

import type { TeacherSession } from "../types/calendar.types";

export default function TeacherCalendarPage() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const sessions: TeacherSession[] = [
    { id: 1, date: "2025-10-28", student: "Emily Parker", subject: "Mathematics", time: "2:00 PM", duration: "1 hour", status: "completed", focusScore: 92 },
    { id: 2, date: "2025-10-29", student: "James Wilson", subject: "Physics", time: "10:00 AM", duration: "1.5 hours", status: "upcoming" },
    { id: 3, date: "2025-10-30", student: "Sarah Martinez", subject: "Chemistry", time: "3:00 PM", duration: "1 hour", status: "pending" },
    { id: 4, date: "2025-11-01", student: "David Lee", subject: "Mathematics", time: "2:00 PM", duration: "1 hour", status: "upcoming" },
    { id: 5, date: "2025-11-03", student: "Lisa Anderson", subject: "Biology", time: "11:00 AM", duration: "1 hour", status: "upcoming" },
    { id: 6, date: "2025-11-05", student: "Michael Brown", subject: "Physics", time: "4:00 PM", duration: "1 hour", status: "upcoming" },
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return sessions.filter((s) => s.date === dateString);
  };

  const selectedDateSessions = selectedDate
    ? getSessionsForDate(selectedDate)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-500" />
              <span className="text-2xl text-blue-900">ScholaAi</span>
            </div>

            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-purple-500 text-white">DR</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-4xl text-blue-900">My Teaching Calendar</h1>
          <p className="text-gray-600">View and manage all your scheduled sessions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <TeacherCalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              sessions={sessions}
              previousMonth={previousMonth}
              nextMonth={nextMonth}
            />
          </div>

          <TeacherSidebar
            selectedDate={selectedDate}
            sessions={selectedDateSessions}
            allSessions={sessions}
            currentMonth={currentMonth}
          />
        </div>
      </div>
    </div>
  );
}