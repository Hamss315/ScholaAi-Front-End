import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import type { UpcomingSession } from "../types/dashboard.types";
import { useNavigate } from "react-router-dom";
import { parseUTCDate, getInitials } from "../../../utils/utils";

export default function UpcomingSessions({
  sessions,
}: {
  sessions: UpcomingSession[];
}) {
  const navigate = useNavigate();

  const formatTime = (scheduledAt: string) => {
    try {
      return parseUTCDate(scheduledAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "TBD";
    }
  };

  const getCountdown = (scheduledAt: string) => {
    try {
      const diff = parseUTCDate(scheduledAt).getTime() - Date.now();
      if (diff <= 0) {
        const minsPast = Math.abs(Math.floor(diff / 60000));
        if (minsPast < 2) return "Starting soon";
        if (minsPast < 60) return `${minsPast}m ago`;
        const hrs = Math.floor(minsPast / 60);
        return `${hrs}h ago`;
      }
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `in ${mins}m`;
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `in ${hrs}h ${rem}m` : `in ${hrs}h`;
    } catch {
      return "";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#1E3A8A]">Upcoming Sessions</h2>
        <Button
          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          onClick={() => navigate("/request-session")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No upcoming sessions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-[#3B82F6] text-white">
                    {getInitials(s.teacherName) || "TS"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-[#1E3A8A] font-medium">{s.teacherName}</div>
                  <div className="text-sm text-gray-600">{s.subjectName}</div>
                </div>
              </div>

              {/* RIGHT — date + countdown only, no join button */}
              <div className="text-right">
                <div className="text-sm text-[#3B82F6]">{formatTime(s.scheduledAt)}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
                  <Clock className="w-3 h-3" />
                  {getCountdown(s.scheduledAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}