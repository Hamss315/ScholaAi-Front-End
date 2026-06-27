import { Clock, MessageSquare, GraduationCap, Star } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { getInitials } from "../../../utils/utils";
import type { Teacher } from "../types/teacher.types";
import { useNavigate } from "react-router-dom";

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const navigate = useNavigate();

  const initials = getInitials(teacher.userName) || "T";
 
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">

      <div className="flex gap-4 mb-4">
        <Avatar className="w-16 h-16">
          {teacher.profilePhotoURL ? (
            <AvatarImage src={teacher.profilePhotoURL} alt={teacher.userName} />
          ) : null}
          <AvatarFallback className="bg-[#8B5CF6] text-white text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-xl" style={{ color: "#1E3A8A" }}>
            {teacher.userName}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            {teacher.college || "University"}
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3.5 h-3.5"
                  style={{
                    fill: s <= (teacher.rating || 0) ? "#FACC15" : "transparent",
                    color: s <= (teacher.rating || 0) ? "#FACC15" : "#D1D5DB",
                  }}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-700">
              {teacher.rating ? teacher.rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-gray-400">
              ({teacher.totalRatings || 0} {teacher.totalRatings === 1 ? "rating" : "ratings"})
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-purple-100 text-purple-700">
          {teacher.subject}
        </Badge>
      </div>

      <div className="border-t pt-4 mb-4 flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {teacher.teachingExperience || "N/A"} experience
        </div>
      </div>

      <Button
        className="w-full bg-[#3B82F6]"
        onClick={() => {
          const tId = teacher.teacherId || teacher.userId || teacher.id;
          if (!tId) {
            console.warn("Teacher ID not found for teacher:", teacher);
            return;
          }
          navigate(`/chat/${tId}`, {
            state: {
              chat: {
                id: tId,
                otherUserId: tId,
                otherUserName: teacher.userName,
                otherUserRole: "teacher",
                subject: teacher.subject,
                unreadCount: 0,
                online: false,
              },
            },
          });
        }}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Chat
      </Button>

    </Card>
  );
}