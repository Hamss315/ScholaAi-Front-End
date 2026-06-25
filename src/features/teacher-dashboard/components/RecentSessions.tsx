import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { BookOpen } from "lucide-react";
import type { RecentSession } from "../types/dashboard.types";
import { parseUTCDate } from "../../../utils/utils";

export default function RecentSessions({
  sessions,
}: {
  sessions: RecentSession[];
}) {
  const formatDate = (scheduledAt: string) => {
    try {
      return parseUTCDate(scheduledAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
          Recent Sessions
        </h2>
        <BookOpen className="w-5 h-5 text-gray-400" />
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No recent sessions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-[#3B82F6] text-white text-sm">
                    {"ST"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: "#1E3A8A" }}>
                    {s.studentName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.subjectName} · {formatDate(s.scheduledAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Student Focus:</span>
                <Progress value={s.studentFocusScore} className="flex-1" />
                <span
                  className={`text-sm font-medium ${s.studentFocusScore >= 90 ? "text-green-500" : "text-blue-500"
                    }`}
                >
                  {s.studentFocusScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
