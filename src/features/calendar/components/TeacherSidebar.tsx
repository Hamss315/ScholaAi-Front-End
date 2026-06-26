import { useNavigate } from "react-router-dom";
import { Clock, Video, CheckCircle, Calendar as CalendarIcon } from "lucide-react";

import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { getInitials } from "../../../utils/utils";

import type { TeacherSession } from "../types/calendar.types";
import { isSameLocalMonth } from "../services/calendar.service";

interface Props {
  selectedDate: Date | null;
  sessions: TeacherSession[];      // selected day sessions
  allSessions: TeacherSession[];   // full dataset for stats
  currentMonth: Date;
}

export default function TeacherSidebar({
  selectedDate,
  sessions,
  allSessions,
  currentMonth,
}: Props) {
  const navigate = useNavigate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const getMonthFiltered = (status?: TeacherSession["status"]) => {
    return allSessions.filter((s) => {
      if (!isSameLocalMonth(s.date, currentMonth)) return false;
      return status ? s.status === status : true;
    });
  };

  return (
    <Card className="p-6 sticky top-24">

      {/* HEADER */}
      <h3 className="text-xl mb-4" style={{ color: "#1E3A8A" }}>
        {selectedDate
          ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
          : "Select a Date"}
      </h3>

      {/* SESSION LIST */}
      {selectedDate ? (
        sessions.length > 0 ? (
          <div className="space-y-4">

            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border ${
                  session.status === "upcoming"
                    ? "bg-blue-50 border-blue-200"
                    : session.status === "completed"
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >

                {/* STATUS */}
                <div className="flex justify-between mb-3">
                  <Badge
                    className={
                      session.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : session.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {session.status === "upcoming" && (
                      <Video className="w-3 h-3 mr-1" />
                    )}
                    {session.status === "completed" && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {session.status === "pending" && (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {session.status}
                  </Badge>
                </div>

                {/* STUDENT INFO */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getInitials(session.student) || "ST"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div style={{ color: "#1E3A8A" }}>{session.student}</div>
                    <div className="text-sm text-gray-600">
                      {session.subject}
                    </div>
                  </div>
                </div>

                {/* TIME */}
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {session.time} • {session.duration}
                </div>

                {/* FOCUS SCORE */}
                {session.focusScore !== undefined && (
                  <div className="flex justify-between mt-2 pt-2 border-t text-sm">
                    <span className="text-gray-600">Focus Score</span>
                    <span className="text-green-500">
                      {session.focusScore}%
                    </span>
                  </div>
                )}

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
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No sessions scheduled</p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Select a date</p>
        </div>
      )}

      {/* STATS */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm mb-3 text-gray-600">This Month</h4>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Total</span>
            <span>{getMonthFiltered().length}</span>
          </div>

          <div className="flex justify-between">
            <span>Completed</span>
            <span className="text-green-500">
              {getMonthFiltered("completed").length}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Upcoming</span>
            <span className="text-blue-500">
              {getMonthFiltered("upcoming").length}
            </span>
          </div>

        </div>
      </div>
    </Card>
  );
}