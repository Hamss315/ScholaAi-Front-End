import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

interface TalkingTimeData {
  student: number;
  teacher: number;
}

interface TalkingTimeDistributionProps {
  talkingTime: TalkingTimeData;
  focusScore: number;
}

export default function TalkingTimeDistribution({
  talkingTime,
  focusScore,
}: TalkingTimeDistributionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6" style={{ color: "#1E3A8A" }}>
        Talking Time Distribution
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6]"></div>
              <span className="text-sm font-medium text-gray-700">Student</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "#3B82F6" }}>
              {talkingTime.student}%
            </span>
          </div>
          <Progress value={talkingTime.student} className="h-3" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-sm font-medium text-gray-700">Teacher</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "#8B5CF6" }}>
              {talkingTime.teacher}%
            </span>
          </div>
          <Progress value={talkingTime.teacher} className="h-3" />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-500 font-medium mb-2">
            Overall Focus Score
          </div>
          <div className="flex items-center gap-4">
            <Progress value={focusScore} className="h-2 flex-1" />
            <span className="text-xl font-bold text-green-600">
              {focusScore}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
