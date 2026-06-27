import { Video, TrendingUp, BookOpen } from "lucide-react";
import { Card } from "../../../../components/ui/card";

interface Props {
  totalSessions: number;
  avgFocusScore: number | null;
  subjectsCovered: number;
}

export default function AllSessionsStats({
  totalSessions,
  avgFocusScore,
  subjectsCovered,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Video className="w-6 h-6" style={{ color: "#3B82F6" }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: "#1E3A8A" }}>
            {totalSessions}
          </div>
          <div className="text-sm text-gray-500">Total Sessions</div>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <TrendingUp className="w-6 h-6" style={{ color: "#22C55E" }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: "#22C55E" }}>
            {avgFocusScore != null ? `${avgFocusScore}%` : "—"}
          </div>
          <div className="text-sm text-gray-500">Avg Focus Score</div>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <BookOpen className="w-6 h-6" style={{ color: "#8B5CF6" }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: "#8B5CF6" }}>
            {subjectsCovered}
          </div>
          <div className="text-sm text-gray-500">Subjects Covered</div>
        </div>
      </Card>
    </div>
  );
}
