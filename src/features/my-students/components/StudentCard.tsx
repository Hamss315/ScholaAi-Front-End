import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import type { Student } from "../types/students.types";
import { useNavigate } from "react-router-dom";

interface Props {
  student: Student;
  variant: "active" | "inactive";
  onNavigate: (path: string) => void;
}

export default function StudentCard({ student, variant }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`p-4 bg-gray-50 rounded-lg border border-gray-200 transition ${variant === "inactive" ? "opacity-75" : "hover:bg-gray-100"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Avatar
            className="w-12 h-12 cursor-pointer"
            onClick={() => navigate(`/student/profile/${student.id}`)}
          >
            <AvatarFallback
              className={variant === "active" ? "bg-blue-500 text-white" : "bg-gray-400 text-white"}
            >
              {student.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
              {student.name}
            <div className="text-sm text-gray-600 mb-2">{student.subject}</div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-500">Total Sessions</p>
                <p className="font-medium">{student.totalSessions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Hours</p>
                <p className="font-medium">{student.totalHours}h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Focus</p>
                <p className="font-medium">
                  {student.avgFocusScore != null ? `${student.avgFocusScore}%` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Session</p>
                <p className="font-medium">{student.lastSession}</p>
              </div>
            </div>

            {variant === "active" && student.nextSession !== "Not scheduled" && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Next session:</span>
                <span className="text-blue-500">{student.nextSession}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/chat/${student.id}`, {
                state: {
                  chat: {
                    id: student.id,
                    otherUserId: student.id,
                    otherUserName: student.name,
                    otherUserRole: "student",
                    unreadCount: 0,
                    online: false,
                  },
                },
              })
            }
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}