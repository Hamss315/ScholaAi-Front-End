export const subjectStats = [
  {
    subject: "Mathematics",
    sessions: 3,
    avgFocus: 87,
    avgPositive: 63,
    hoursLearned: "4h 30m",
    trend: "+4%",
    trendUp: true,
    color: "#3B82F6",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    subject: "English",
    sessions: 2,
    avgFocus: 94,
    avgPositive: 72,
    hoursLearned: "2h 15m",
    trend: "+2%",
    trendUp: true,
    color: "#8B5CF6",
    badgeClass: "bg-purple-100 text-purple-700",
  },
  {
    subject: "Chemistry",
    sessions: 2,
    avgFocus: 88,
    avgPositive: 68,
    hoursLearned: "2h 30m",
    trend: "+6%",
    trendUp: true,
    color: "#22C55E",
    badgeClass: "bg-green-100 text-green-700",
  },
  {
    subject: "Physics",
    sessions: 2,
    avgFocus: 78,
    avgPositive: 55,
    hoursLearned: "2h 15m",
    trend: "-2%",
    trendUp: false,
    color: "#6366F1",
    badgeClass: "bg-indigo-100 text-indigo-700",
  },
  {
    subject: "Biology",
    sessions: 1,
    avgFocus: 87,
    avgPositive: 66,
    hoursLearned: "1h 00m",
    trend: "—",
    trendUp: true,
    color: "#10B981",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
];

export const overallStats = {
  totalSessions: 10,
  avgFocusScore: 87,
  avgPositiveExpression: 65,
  totalHours: "12h 30m",
  bestSubject: "English",
  mostImproved: "Chemistry",
};

export const focusTrendData = [
  { month: "Sep", Mathematics: 90, English: 93, Physics: 79, Chemistry: 85, Biology: null },
  { month: "Oct", Mathematics: 82, English: 95, Physics: 76, Chemistry: 91, Biology: 87 },
  { month: "Nov", Mathematics: 88, English: null, Physics: null, Chemistry: null, Biology: null },
];

export const radarData = subjectStats.map((s) => ({
  subject: s.subject,
  "Focus Score": s.avgFocus,
  "Positive Expression": s.avgPositive,
}));

export const barData = subjectStats.map((s) => ({
  subject: s.subject.slice(0, 4) + ".",
  "Avg Focus": s.avgFocus,
  Sessions: s.sessions * 10,
}));

export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#3B82F6",
  English: "#8B5CF6",
  Physics: "#6366F1",
  Chemistry: "#22C55E",
  Biology: "#10B981",
};

export function focusColor(score: number) {
  if (score >= 90) return "#22C55E";
  if (score >= 80) return "#3B82F6";
  return "#F59E0B";
}
