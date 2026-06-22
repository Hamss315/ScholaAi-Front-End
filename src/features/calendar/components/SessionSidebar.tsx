import { Clock, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useNavigate } from "react-router-dom";

import type { StudentSession } from "../types/calendar.types";
import { isSameLocalMonth } from "../services/calendar.service";

interface Props {
  selectedDate: Date | null;
  sessions: StudentSession[];      // selected day sessions
  allSessions: StudentSession[];   // ALL sessions (for stats)
  currentMonth: Date;
}

export default function SessionSidebar({
  selectedDate,
  sessions,
  allSessions,
  currentMonth,
}: Props) {
  const navigate = useNavigate();

  return (
    <div>
      {/* ================= SIDEBAR ================= */}
      <Card className="p-6 sticky top-24">
        <h3 className="text-xl mb-4" style={{ color: "#1E3A8A" }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Select a Date"}
        </h3>

        {selectedDate && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 border-2 rounded-lg hover:border-blue-300 transition-colors"
              >
                {/* TITLE + STATUS */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: "#1E3A8A" }}>
                        {session.subject}
                      </span>

                      <Badge
                        className={
                          session.status === "upcoming"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : session.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      {session.teacher}
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {session.time} ({session.duration})
                  </div>

                  {session.status === "completed" &&
                    session.focusScore && (
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          className="w-4 h-4"
                          style={{ color: "#22C55E" }}
                        />
                        <span className="text-gray-600">
                          Focus Score:
                        </span>
                        <span style={{ color: "#22C55E" }}>
                          {session.focusScore}%
                        </span>
                      </div>
                    )}
                </div>

                {/* ACTIONS */}
                {session.status === "completed" && (
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    size="sm"
                    onClick={() => navigate(`/session/${session.id}/notes`)}
                  >
                    View Notes
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : selectedDate ? (
          /* EMPTY DATE (HAS DATE BUT NO SESSIONS) */
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No sessions scheduled for this date</p>

            <Button
              className="mt-4 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
              size="sm"
            >
              Book a Session
            </Button>
          </div>
        ) : (
          /* NO DATE SELECTED */
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Click on a date to view sessions</p>
          </div>
        )}
      </Card>

      {/* ================= QUICK STATS ================= */}
      <Card className="p-6 mt-6">
        <h3 className="mb-4" style={{ color: "#1E3A8A" }}>
          This Month
        </h3>

        <div className="space-y-3">
          {/* TOTAL */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total Sessions</span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {allSessions.filter((s) => isSameLocalMonth(s.date, currentMonth)).length}
            </Badge>
          </div>

          {/* COMPLETED */}
          <div className="flex justify-between">
            <span className="text-gray-600">Completed</span>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              {allSessions.filter(
                (s) => s.status === "completed" && isSameLocalMonth(s.date, currentMonth)
              ).length}
            </Badge>
          </div>

          {/* UPCOMING */}
          <div className="flex justify-between">
            <span className="text-gray-600">Upcoming</span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {allSessions.filter(
                (s) => s.status === "upcoming" && isSameLocalMonth(s.date, currentMonth)
              ).length}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}