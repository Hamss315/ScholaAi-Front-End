import { SmilePlus, Meh, Frown } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

interface ExpressionsData {
  positive: number;
  neutral: number;
  negative: number;
}

interface EmotionAnalysisProps {
  expressions: ExpressionsData;
}

export default function EmotionAnalysis({ expressions }: EmotionAnalysisProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6" style={{ color: "#1E3A8A" }}>
        Emotional Expressions
      </h3>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Positive</span>
            </div>
            <span className="text-sm font-bold text-green-600">
              {expressions.positive}%
            </span>
          </div>
          <Progress
            value={expressions.positive}
            className="h-2 bg-green-50"
            style={
              {
                "--progress-indicator-bg": "#22C55E",
              } as React.CSSProperties
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Meh className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Neutral</span>
            </div>
            <span className="text-sm font-bold text-gray-600">
              {expressions.neutral}%
            </span>
          </div>
          <Progress
            value={expressions.neutral}
            className="h-2 bg-gray-100"
            style={
              {
                "--progress-indicator-bg": "#4B5563",
              } as React.CSSProperties
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Frown className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Negative</span>
            </div>
            <span className="text-sm font-bold text-red-600">
              {expressions.negative}%
            </span>
          </div>
          <Progress
            value={expressions.negative}
            className="h-2 bg-red-50"
            style={
              {
                "--progress-indicator-bg": "#EF4444",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </Card>
  );
}
