import { Card } from "../../../components/ui/card";
import { Users, BookOpen, Clock, Star } from "lucide-react";

interface Props {
  totalStudents: number;
  activeStudents: number;
  totalSessions: number;
  totalHours: number;
  avgRating: number;
}

export default function StudentsStats({
  totalStudents,
  activeStudents,
  totalSessions,
  totalHours,
  avgRating,
}: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total Students</span>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1 text-blue-500">{totalStudents}</div>
        <span className="text-sm text-gray-500">{activeStudents} active</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total Sessions</span>
          <BookOpen className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1 text-purple-500">{totalSessions}</div>
        <span className="text-sm text-gray-500">Across all students</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Hours Taught</span>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1 text-green-500">{totalHours}h</div>
        <span className="text-sm text-gray-500">Total time invested</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Avg Rating</span>
          <Star className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1 text-yellow-400">{avgRating.toFixed(1)}</div>
        <span className="text-sm text-gray-500">★★★★★</span>
      </Card>

    </div>
  );
}