import { Award, TrendingUp } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface PerformanceHighlightsProps {
  bestSubject: string;
  bestSubjectFocus: number;
  mostImprovedSubject: string;
  mostImprovedImprovement: string;
}

export default function PerformanceHighlights({
  bestSubject,
  bestSubjectFocus,
  mostImprovedSubject,
  mostImprovedImprovement,
}: PerformanceHighlightsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <Card className="p-5 border-l-4" style={{ borderLeftColor: '#22C55E' }}>
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8" style={{ color: '#22C55E' }} />
          <div>
            <div className="text-sm text-gray-500 mb-0.5">Best Performing Subject</div>
            <div className="text-xl" style={{ color: '#1E3A8A' }}>{bestSubject}</div>
            <div className="text-sm" style={{ color: '#22C55E' }}>Avg Focus: {bestSubjectFocus}%</div>
          </div>
        </div>
      </Card>
      <Card className="p-5 border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8" style={{ color: '#3B82F6' }} />
          <div>
            <div className="text-sm text-gray-500 mb-0.5">Most Improved Subject</div>
            <div className="text-xl" style={{ color: '#1E3A8A' }}>{mostImprovedSubject}</div>
            <div className="text-sm" style={{ color: '#3B82F6' }}>{mostImprovedImprovement}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

