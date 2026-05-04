import { Star, DollarSign, Clock, Video } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import type { Teacher } from "../types/teacher.types";
import { useNavigate } from "react-router-dom";

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">

      <div className="flex gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-[#8B5CF6] text-white text-xl">
            {teacher.avatar}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-xl" style={{ color: "#1E3A8A" }}>
            {teacher.name}
          </h3>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {teacher.rating}
            <span className="text-sm text-gray-500">
              ({teacher.reviews})
            </span>
          </div>

          <div className="flex items-center text-green-600">
            <DollarSign className="w-4 h-4" />
            ${teacher.hourlyRate}/hr
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {teacher.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {teacher.subjects.map((s, i) => (
          <Badge key={i} className="bg-purple-100 text-purple-700">
            {s}
          </Badge>
        ))}
      </div>

      <div className="border-t pt-4 mb-4 flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {teacher.experience}
        </div>
        <span>{teacher.students} students</span>
      </div>

      <Button
        className="w-full bg-[#3B82F6]"
        onClick={() => navigate(`/request-session/${teacher.id}`)}
      >
        <Video className="w-4 h-4 mr-2" />
        Book Session
      </Button>

    </Card>
  );
}