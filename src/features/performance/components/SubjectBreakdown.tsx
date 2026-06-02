import { BookOpen, Clock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { subjectStats, focusColor } from "../data/performanceData";

export default function SubjectBreakdown() {
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" style={{ color: '#3B82F6' }} />
        <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>Subject Breakdown</h2>
      </div>
      <div className="space-y-4">
        {subjectStats.map((s) => (
          <Card key={s.subject} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Left: Subject + stats */}
              <div className="flex items-center gap-4 flex-1 min-w-[13rem]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}20` }}>
                  <BookOpen className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg" style={{ color: '#1E3A8A' }}>{s.subject}</span>
                    <Badge className={`${s.badgeClass} hover:${s.badgeClass} text-xs`}>{s.sessions} session{s.sessions > 1 ? "s" : ""}</Badge>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        color: s.trendUp ? '#22C55E' : '#EF4444',
                        backgroundColor: s.trendUp ? '#dcfce7' : '#fee2e2',
                      }}
                    >
                      {s.trend}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />{s.hoursLearned} total
                  </div>
                </div>
              </div>

              {/* Right: Metrics */}
              <div className="flex gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Avg Focus</div>
                  <div className="text-2xl" style={{ color: focusColor(s.avgFocus) }}>{s.avgFocus}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Positive Mood</div>
                  <div className="text-2xl" style={{ color: '#22C55E' }}>{s.avgPositive}%</div>
                </div>
              </div>
            </div>

            {/* Focus bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Average Focus Score</span>
                <span>{s.avgFocus}%</span>
              </div>
              <Progress value={s.avgFocus} className="h-2" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
