import { Video, TrendingUp, BookOpen } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { allSessions, subjects } from "../../data/allSessionsData";

export default function AllSessionsStats() {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Video className="w-6 h-6" style={{ color: '#3B82F6' }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: '#1E3A8A' }}>{allSessions.length}</div>
          <div className="text-sm text-gray-500">Total Sessions</div>
        </div>
      </Card>
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <TrendingUp className="w-6 h-6" style={{ color: '#22C55E' }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: '#22C55E' }}>
            {Math.round(allSessions.reduce((a, s) => a + s.focusScore, 0) / allSessions.length)}%
          </div>
          <div className="text-sm text-gray-500">Avg Focus Score</div>
        </div>
      </Card>
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <BookOpen className="w-6 h-6" style={{ color: '#8B5CF6' }} />
        </div>
        <div>
          <div className="text-2xl" style={{ color: '#8B5CF6' }}>{subjects.length - 1}</div>
          <div className="text-sm text-gray-500">Subjects Covered</div>
        </div>
      </Card>
    </div>
  );
}
