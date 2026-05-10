import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
// import { getCurrentUserProfile, type TeacherProfile } from "../../../utils/userDataService"; // removing unneeded imports that cause error

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import ActiveSessions from "../components/ActiveSessions";
import UpcomingClasses from "../components/UpcomingClasses";
import PerformanceAnalytics from "../components/PerformanceAnalytics";
import CalendarCard from "../components/CalendarCard";
import EarningsCard from "../components/EarningsCard";
import TodayOverview from "../components/TodayOverview";

import { getTeacherDashboardOverview, type TeacherDashboardOverview } from "../../../services/api/teacherDashboard";

export default function TeacherDashboardPage() {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [thisWeekEarnings, setThisWeekEarnings] = useState(0);
  const [lastMonthEarnings, setLastMonthEarnings] = useState(0);
  const [avgFocusScore, setAvgFocusScore] = useState(0);

  useEffect(() => {
    getTeacherDashboardOverview().then((overview: TeacherDashboardOverview) => {
      setActiveSessions(overview.activeSessions);
      setUpcomingClasses(overview.upcomingClasses);
      setTeacherName(overview.teacherName || "Teacher");
      setTodayEarnings(overview.todayEarnings || 0);
      setThisMonthEarnings(overview.thisMonthEarnings || 0);
      setAvgRating(overview.avgRating || 0);
      setThisWeekEarnings(overview.earningsSummary.thisWeek || 0);
      setLastMonthEarnings(overview.earningsSummary.lastMonth || 0);

      const focusValues = overview.recentSessions
        .map((s) => s.focusScore)
        .filter((v) => typeof v === "number" && v > 0);
      const avgFocus = focusValues.length > 0
        ? focusValues.reduce((sum, v) => sum + v, 0) / focusValues.length
        : 0;
      setAvgFocusScore(avgFocus);
    });
  }, []);

  // Get available days based on teacher's availability
  const getAvailableDays = () => {
    // TODO: wire teacher availability from profile service.
    return [] as number[];
  };

  const availableDays = getAvailableDays();
  const activeStudents = new Set(upcomingClasses.map((s) => s.student)).size;
  const todayKey = new Date().toISOString().split("T")[0];
  const sessionsToday = upcomingClasses.filter(
    (s) => s.scheduledAt && s.scheduledAt.startsWith(todayKey)
  ).length;
  const hoursTaughtToday = sessionsToday;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: '#1E3A8A' }}>Welcome, {teacherName}!</h1>
          <p className="text-gray-600">Your teaching dashboard for today</p>
        </div>

        <DashboardStats
          todayEarnings={todayEarnings}
          thisMonthEarnings={thisMonthEarnings}
          activeStudents={activeStudents}
          avgRating={avgRating}
        />

        {/* Engagement Alerts */}
        {activeSessions.some(s => s.status === "warning") && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4" style={{ color: '#FACC15' }} />
            <AlertDescription>
              <span style={{ color: '#1E3A8A' }}>Student engagement alert:</span> Emily Parker's focus has dropped to 85%. Consider interactive activities.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeSessions.length > 0 && (
              <ActiveSessions sessions={activeSessions} />
            )}

            <UpcomingClasses upcoming={upcomingClasses} />

            <PerformanceAnalytics
              totalUpcoming={upcomingClasses.length}
              avgRating={avgRating}
              avgFocus={avgFocusScore}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CalendarCard availableDays={availableDays} />
            <EarningsCard
              thisWeek={thisWeekEarnings}
              lastMonth={lastMonthEarnings}
              thisMonth={thisMonthEarnings}
            />
            <TodayOverview
              sessionsToday={sessionsToday}
              hoursTaught={hoursTaughtToday}
              avgFocus={avgFocusScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}