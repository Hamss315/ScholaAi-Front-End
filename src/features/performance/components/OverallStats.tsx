import { Video, Target, Clock, BookOpen } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { focusColor } from "../data/performanceData";

interface OverallStatsProps {
  totalSessions: number;
  avgFocusScore: number;
  totalHours: string;
  subjectCount: number;
}

export default function OverallStats({
  totalSessions,
  avgFocusScore,
  totalHours,
  subjectCount,
}: OverallStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Total Sessions</span>
          <Video className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#1E3A8A' }}>{totalSessions}</div>
        <span className="text-xs text-gray-400">All subjects</span>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Avg Focus</span>
          <Target className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: focusColor(avgFocusScore) }}>
          {avgFocusScore}%
        </div>
        <span className="text-xs text-gray-400">All sessions</span>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Total Hours</span>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#1E3A8A' }}>{totalHours}</div>
        <span className="text-xs text-gray-400">Learning time</span>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Subjects</span>
          <BookOpen className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#8B5CF6' }}>{subjectCount}</div>
        <span className="text-xs text-gray-400">Active this term</span>
      </Card>
    </div>
  );
}

