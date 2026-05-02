import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Calendar } from "lucide-react";
import type { UpcomingSession } from "../types/dashboard.types";
import { useNavigate } from "react-router-dom";

export default function UpcomingSessions({
  sessions,
}: {
  sessions: UpcomingSession[];
}) {
  const navigate = useNavigate();

  return (
    <Card className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#1E3A8A]">
          Upcoming Sessions
        </h2>

        <Button
          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          onClick={() => navigate("/request-session")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>

      <div className="space-y-4">

        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              <Avatar
                className="cursor-pointer"
                onClick={() => navigate("/teacher/profile")}
              >
                <AvatarFallback className="bg-[#3B82F6] text-white">
                  {s.teacher.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <div
                  className="text-[#1E3A8A] cursor-pointer hover:underline"
                  onClick={() => navigate("/teacher/profile")}
                >
                  {s.teacher}
                </div>

                <div className="text-sm text-gray-600">
                  {s.subject}
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              <div className="text-right">
                <div className="text-sm text-[#3B82F6]">
                  {s.time}
                </div>
                <div className="text-sm text-gray-500">
                  {s.duration}
                </div>
              </div>

              {s.isCurrent && (
                <Button
                  className="bg-[#22C55E] hover:bg-[#22C55E]/90"
                  onClick={() => navigate("/live-session")}
                >
                  Join Now
                </Button>
              )}

            </div>

          </div>
        ))}

      </div>
    </Card>
  );
}