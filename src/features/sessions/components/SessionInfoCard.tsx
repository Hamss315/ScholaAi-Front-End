import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface SessionData {
  lessonTitle: string;
  lessonDescription: string;
  subject: string;
  studentLevel: string;
  studentName: string;
  teacherName: string;
  sessionDate: string;
  sessionDuration: string;
}

interface SessionInfoCardProps {
  sessionData: SessionData;
}

export default function SessionInfoCard({ sessionData }: SessionInfoCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-6 mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Lesson Title</div>
          <div className="text-xl mb-4 font-semibold" style={{ color: "#1E3A8A" }}>
            {sessionData.lessonTitle}
          </div>

          <div className="text-sm text-gray-600 mb-1">Lesson Description</div>
          <div className="text-gray-700 leading-relaxed text-sm">
            {sessionData.lessonDescription}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Subject</div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                <BookOpen className="w-3 h-3 mr-1" />
                {sessionData.subject}
              </Badge>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Student Level</div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">
                <GraduationCap className="w-3 h-3 mr-1" />
                {sessionData.studentLevel}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Student</div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#3B82F6] text-white text-xs">
                  {getInitials(sessionData.studentName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-700 text-sm font-medium">{sessionData.studentName}</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Teacher</div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">
                  {getInitials(sessionData.teacherName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-700 text-sm font-medium">{sessionData.teacherName}</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {sessionData.sessionDate}
            </div>
            <div>
              Duration: <span className="font-semibold text-gray-700">{sessionData.sessionDuration}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
