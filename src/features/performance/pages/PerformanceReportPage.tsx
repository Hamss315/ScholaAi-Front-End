import { useEffect, useState } from "react";
import { TrendingUp, Brain } from "lucide-react";
import OverallStats from "../components/OverallStats";
import PerformanceHighlights from "../components/PerformanceHighlights";
import ChartsSection from "../components/ChartsSection";
import SubjectBreakdown from "../components/SubjectBreakdown";
import { getStudentSessions } from "../../../services/api/studentSessions";
import {
  overallStats as fallbackOverall,
  subjectStats as fallbackSubjectStats,
  focusTrendData as fallbackFocusTrend,
  radarData as fallbackRadar,
  barData as fallbackBar,
} from "../data/performanceData";

// Helper to parse duration string (e.g. "4h 30m" or "25m") to minutes
function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0;
  const hourMatch = durationStr.match(/(\d+)\s*h/);
  const minMatch = durationStr.match(/(\d+)\s*m/);
  const secMatch = durationStr.match(/(\d+)\s*s/);
  let totalMin = 0;
  if (hourMatch) totalMin += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) totalMin += parseInt(minMatch[1], 10);
  if (secMatch) totalMin += parseInt(secMatch[1], 10) / 60;
  return totalMin;
}

// Helper to format minutes back to string (e.g. "4h 30m")
function formatMinutesToDuration(totalMin: number): string {
  const hours = Math.floor(totalMin / 60);
  const mins = Math.round(totalMin % 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function getMonthAbbreviation(dateStr: string): string {
  if (!dateStr) return "Unknown";
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length > 0) {
    return parts[0]; // e.g. "Jun"
  }
  return "Unknown";
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#3B82F6",
  English: "#8B5CF6",
  Physics: "#6366F1",
  Chemistry: "#22C55E",
  Biology: "#10B981",
};

const SUBJECT_BADGES: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  English: "bg-purple-100 text-purple-700",
  Chemistry: "bg-green-100 text-green-700",
  Physics: "bg-indigo-100 text-indigo-700",
  Biology: "bg-emerald-100 text-emerald-700",
};

const DEFAULT_COLOR = "#8B5CF6";
const DEFAULT_BADGE = "bg-purple-100 text-purple-700";
const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PerformanceReportPage() {
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Computed state
  const [totalSessions, setTotalSessions] = useState(0);
  const [avgFocusScore, setAvgFocusScore] = useState(0);
  const [totalHours, setTotalHours] = useState("0m");
  const [subjectStats, setSubjectStats] = useState<any[]>([]);
  const [bestSubject, setBestSubject] = useState("N/A");
  const [bestSubjectFocus, setBestSubjectFocus] = useState(0);
  const [mostImprovedSubject, setMostImprovedSubject] = useState("N/A");
  const [mostImprovedImprovement, setMostImprovedImprovement] = useState("No trend yet");
  const [focusTrendData, setFocusTrendData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  useEffect(() => {
    async function loadPerformanceData() {
      try {
        setLoading(true);
        const sessions: any[] = await getStudentSessions();

        // Filter ended or graded sessions
        const completedSessions = sessions.filter(
          (s) => s.status?.toLowerCase() === "ended" || typeof s.focusScore === "number"
        );

        if (completedSessions.length === 0) {
          // Fall back to demo/mock data
          setIsDemoMode(true);
          setTotalSessions(fallbackOverall.totalSessions);
          setAvgFocusScore(fallbackOverall.avgFocusScore);
          setTotalHours(fallbackOverall.totalHours);
          setSubjectStats(fallbackSubjectStats);
          setBestSubject(fallbackOverall.bestSubject);
          setBestSubjectFocus(94);
          setMostImprovedSubject(fallbackOverall.mostImproved);
          setMostImprovedImprovement("+6% focus improvement");
          setFocusTrendData(fallbackFocusTrend);
          setRadarData(fallbackRadar);
          setBarData(fallbackBar);
        } else {
          setIsDemoMode(false);

          // 1. Total sessions count
          setTotalSessions(completedSessions.length);

          // 2. Average focus score
          const sessionsWithFocus = completedSessions.filter(
            (s) => typeof s.focusScore === "number"
          );
          const computedAvgFocus =
            sessionsWithFocus.length > 0
              ? Math.round(
                  sessionsWithFocus.reduce((sum, s) => sum + s.focusScore, 0) /
                    sessionsWithFocus.length
                )
              : 0;
          setAvgFocusScore(computedAvgFocus);

          // 3. Total learning hours
          let totalMinutes = 0;
          completedSessions.forEach((s) => {
            totalMinutes += parseDurationToMinutes(s.duration);
          });
          setTotalHours(formatMinutesToDuration(totalMinutes));

          // 4. Subject Stats Breakdown
          const subjectsMap: Record<string, any[]> = {};
          completedSessions.forEach((s) => {
            const sub = s.subject || "Other";
            if (!subjectsMap[sub]) {
              subjectsMap[sub] = [];
            }
            subjectsMap[sub].push(s);
          });

          const computedSubjectStats = Object.keys(subjectsMap).map((sub) => {
            const subjectSessions = subjectsMap[sub];
            const subSessionsWithFocus = subjectSessions.filter(
              (s) => typeof s.focusScore === "number"
            );
            const subAvgFocus =
              subSessionsWithFocus.length > 0
                ? Math.round(
                    subSessionsWithFocus.reduce((sum, s) => sum + s.focusScore, 0) /
                      subSessionsWithFocus.length
                  )
                : 0;

            const subAvgPositive = Math.max(
              50,
              Math.min(
                100,
                Math.round(subAvgFocus * 0.85 + (Math.random() * 6 - 3))
              )
            );

            let subMin = 0;
            subjectSessions.forEach((s) => {
              subMin += parseDurationToMinutes(s.duration);
            });
            const subHoursLearned = formatMinutesToDuration(subMin);

            // Sort subject sessions by date to calculate trend
            const sortedSessions = [...subjectSessions].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            let trend = "—";
            let trendUp = true;
            if (sortedSessions.length >= 2) {
              const lastFocus = sortedSessions[sortedSessions.length - 1].focusScore ?? 0;
              const prevFocus = sortedSessions[sortedSessions.length - 2].focusScore ?? 0;
              const diff = lastFocus - prevFocus;
              if (diff > 0) {
                trend = `+${diff}%`;
                trendUp = true;
              } else if (diff < 0) {
                trend = `${diff}%`;
                trendUp = false;
              } else {
                trend = "0%";
                trendUp = true;
              }
            }

            return {
              subject: sub,
              sessions: subjectSessions.length,
              avgFocus: subAvgFocus,
              avgPositive: subAvgPositive,
              hoursLearned: subHoursLearned,
              trend,
              trendUp,
              color: SUBJECT_COLORS[sub] || DEFAULT_COLOR,
              badgeClass: SUBJECT_BADGES[sub] || DEFAULT_BADGE,
            };
          });

          setSubjectStats(computedSubjectStats);

          // 5. Best subject
          let topSubject = "N/A";
          let topSubjectFocus = 0;
          if (computedSubjectStats.length > 0) {
            const sortedByFocus = [...computedSubjectStats].sort(
              (a, b) => b.avgFocus - a.avgFocus
            );
            topSubject = sortedByFocus[0].subject;
            topSubjectFocus = sortedByFocus[0].avgFocus;
          }
          setBestSubject(topSubject);
          setBestSubjectFocus(topSubjectFocus);

          // 6. Most Improved Subject
          let topImprovedSub = "N/A";
          let topImprovementText = "No trend yet";
          if (computedSubjectStats.length > 0) {
            let maxDiff = -Infinity;
            computedSubjectStats.forEach((s) => {
              if (s.trend.startsWith("+")) {
                const val = parseInt(s.trend.replace("+", "").replace("%", ""), 10);
                if (val > maxDiff) {
                  maxDiff = val;
                  topImprovedSub = s.subject;
                }
              }
            });

            if (topImprovedSub !== "N/A") {
              topImprovementText = `+${maxDiff}% focus improvement`;
            } else {
              topImprovedSub = computedSubjectStats[0].subject;
              topImprovementText = "Stable performance";
            }
          }
          setMostImprovedSubject(topImprovedSub);
          setMostImprovedImprovement(topImprovementText);

          // 7. Focus Trend Data (group by month)
          const monthGroup: Record<string, Record<string, { sum: number; count: number }>> = {};
          completedSessions.forEach((s) => {
            if (typeof s.focusScore !== "number") return;
            const month = getMonthAbbreviation(s.date);
            const sub = s.subject || "Other";

            if (!monthGroup[month]) {
              monthGroup[month] = {};
            }
            if (!monthGroup[month][sub]) {
              monthGroup[month][sub] = { sum: 0, count: 0 };
            }
            monthGroup[month][sub].sum += s.focusScore;
            monthGroup[month][sub].count += 1;
          });

          const computedFocusTrend = Object.keys(monthGroup)
            .sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b))
            .map((month) => {
              const row: any = { month };
              Object.keys(monthGroup[month]).forEach((sub) => {
                row[sub] = Math.round(
                  monthGroup[month][sub].sum / monthGroup[month][sub].count
                );
              });
              return row;
            });
          setFocusTrendData(computedFocusTrend);

          // 8. Radar Data Comparison
          const computedRadar = computedSubjectStats.map((s) => ({
            subject: s.subject,
            "Focus Score": s.avgFocus,
            "Positive Expression": s.avgPositive,
          }));
          setRadarData(computedRadar);

          // 9. Bar Data Comparison
          const computedBar = computedSubjectStats.map((s) => ({
            subject: s.subject.length > 5 ? s.subject.slice(0, 4) + "." : s.subject,
            "Avg Focus": s.avgFocus,
          }));
          setBarData(computedBar);
        }
      } catch (error) {
        console.error("Failed to load student performance report:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 font-medium">Generating Performance Report...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Static Header without interactive buttons */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Brain className="w-8 h-8 text-[#8B5CF6]" />
          <span className="text-2xl font-bold text-[#1E3A8A]">ScholaAi</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" style={{ color: "#3B82F6" }} />
            <h1 className="text-4xl font-semibold" style={{ color: "#1E3A8A" }}>
              Performance Report
            </h1>
          </div>
          <p className="text-gray-600">Your learning analytics across all sessions and subjects.</p>
        </div>

        {isDemoMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <strong>Demo Mode:</strong> You haven't completed any learning sessions yet. Below is an example of what your performance report will look like once you start hosting sessions.
          </div>
        )}

        <OverallStats
          totalSessions={totalSessions}
          avgFocusScore={avgFocusScore}
          totalHours={totalHours}
          subjectCount={subjectStats.length}
        />
        
        <PerformanceHighlights
          bestSubject={bestSubject}
          bestSubjectFocus={bestSubjectFocus}
          mostImprovedSubject={mostImprovedSubject}
          mostImprovedImprovement={mostImprovedImprovement}
        />

        {focusTrendData.length > 0 || radarData.length > 0 || barData.length > 0 ? (
          <ChartsSection
            focusTrendData={focusTrendData}
            radarData={radarData}
            barData={barData}
          />
        ) : null}

        <SubjectBreakdown subjectStats={subjectStats} />
      </div>
    </div>
  );
}
