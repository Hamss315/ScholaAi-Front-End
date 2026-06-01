import { Lightbulb } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface StatsData {
  explainedTopics: number;
}

interface SessionStatsProps {
  stats: StatsData;
}

export default function SessionStats({ stats }: SessionStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-6">
      <Card className="p-6 text-center flex flex-col items-center justify-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
          <Lightbulb className="w-6 h-6 text-green-600" />
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: "#1E3A8A" }}>
          {stats.explainedTopics}
        </div>
        <div className="text-sm text-gray-500 font-medium">Topics Explained</div>
      </Card>
    </div>
  );
}
