import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import type { StudentSession } from "../types/calendar.types";

interface Props {
  currentMonth: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  sessions: StudentSession[];
  previousMonth: () => void;
  nextMonth: () => void;
}

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  setSelectedDate,
  sessions,
  previousMonth,
  nextMonth,
}: Props) {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

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

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getSessionsForDate = (date: Date) => {
    const dateString = formatDateKey(date);
    return sessions.filter((s) => s.date === dateString);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: startingDayOfWeek });

  return (
    <Card className="p-6">

      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">

        {dayNames.map((day) => (
          <div key={day} className="text-center p-3 text-gray-600">
            {day}
          </div>
        ))}

        {emptyCells.map((_, i) => (
          <div key={i} className="aspect-square" />
        ))}

        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const daySessions = getSessionsForDate(date);

          const isToday = new Date().toDateString() === date.toDateString();
          const isSelected = selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`aspect-square p-2 rounded-lg border-2 transition-all hover:border-blue-300 ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : isToday
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="h-full flex flex-col">
                <span
                  className={`text-sm mb-1 ${isToday ? "font-bold" : ""}`}
                  style={{ color: isToday ? "#8B5CF6" : "#1E3A8A" }}
                >
                  {day}
                </span>

                {daySessions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {daySessions.map((s) => (
                      <div
                        key={s.id}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            s.status === "upcoming"
                              ? "#3B82F6"
                              : s.status === "completed"
                              ? "#22C55E"
                              : "#FACC15",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}