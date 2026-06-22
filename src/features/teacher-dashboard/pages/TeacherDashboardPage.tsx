import { useState, useEffect, useCallback, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import ActiveSessions from "../components/ActiveSessions";
import UpcomingClasses from "../components/UpcomingClasses";
import RecentSessions from "../components/RecentSessions";
import PerformanceAnalytics from "../components/PerformanceAnalytics";
import CalendarCard from "../components/CalendarCard";
import EarningsCard from "../components/EarningsCard";
import TodayOverview from "../components/TodayOverview";

import {
  getTeacherDashboardOverview,
  type TeacherDashboardOverview,
} from "../../../services/api/teacherDashboard";
import type { ActiveSession, UpcomingClass } from "../types/dashboard.types";


const POLL_MS = 30_000; // 30 seconds
const STORAGE_KEY = "teacher_upcoming_sessions";

const EMPTY: TeacherDashboardOverview = {
  teacherName: "Teacher",
  todayEarnings: 0,
  thisMonthEarnings: 0,
  avgRating: 0,
  earningsSummary: { thisWeek: 0, lastMonth: 0 },
  activeSessions: [],
  upcomingClasses: [],
  recentSessions: [],
  todayOverview: { sessionsToday: 0, hoursTaught: 0, avgFocusScore: 0 },
};

// ─── localStorage helpers ────────────────────────────────────────────────────

function readStorage(): UpcomingClass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: UpcomingClass[] = JSON.parse(raw);
    const now = Date.now();
    // Discard sessions more than 2 hours past their scheduled time
    return parsed.filter((s) => {
      const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
      return minsAfter < 120;
    });
  } catch {
    return [];
  }
}

function writeStorage(sessions: UpcomingClass[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

function removeFromStorage(sessionId: number) {
  writeStorage(readStorage().filter((s) => s.id !== sessionId));
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const [overview, setOverview] = useState<TeacherDashboardOverview>(EMPTY);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>(() => readStorage());
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

  // IDs the teacher has already started — never re-show them in upcoming
  const startedIds = useRef<Set<number>>(new Set());

  /**
   * Merge API sessions with localStorage sessions.
   *
   * - Sessions the API still returns → always included (fresh data)
   * - Sessions we stored locally that the API no longer returns:
   *   kept visible as long as they're within 2 hours of scheduledAt
   *   and the teacher hasn't started them yet.
   *
   * This is what prevents sessions from disappearing after a page refresh
   * when the backend has already dropped them from upcomingSessions.
   */
  const merge = useCallback(
    (apiSessions: UpcomingClass[]): UpcomingClass[] => {
      const stored = readStorage();
      const now = Date.now();
      const apiIds = new Set(apiSessions.map((s) => s.id));

      const retained = stored.filter((s) => {
        if (apiIds.has(s.id)) return false;               // API already has it — no duplicate
        if (startedIds.current.has(s.id)) return false;   // teacher already started it
        const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
        return minsAfter < 120;                            // drop after 2 hours
      });

      const merged = [...apiSessions, ...retained];
      writeStorage(merged); // keep storage up to date
      return merged;
    },
    []
  );

  const load = useCallback(async () => {
    const data = await getTeacherDashboardOverview();
    setOverview(data);
    setActiveSessions(data.activeSessions);
    setUpcomingClasses(merge(data.upcomingClasses));
  }, [merge]);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  /**
   * Teacher pressed Start:
   * 1. Remove session from upcoming (localStorage + state)
   * 2. Add it to active sessions (optimistic)
   */
  const handleSessionStarted = useCallback((session: UpcomingClass) => {
    startedIds.current.add(session.id);
    removeFromStorage(session.id);

    setUpcomingClasses((prev) => prev.filter((s) => s.id !== session.id));

    setActiveSessions((prev) => {
      if (prev.some((s) => s.id === session.id)) return prev;
      return [
        ...prev,
        {
          id: session.id,
          studentName: session.studentName,
          subjectName: session.subjectName,
          scheduledAt: session.scheduledAt,
          studentFocusScore: undefined,
        },
      ];
    });
  }, []);

  /** Teacher pressed End — remove from active */
  const handleSessionEnded = useCallback((sessionId: number) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const avgFocusScore =
    overview.recentSessions.length > 0
      ? overview.recentSessions.reduce((sum, s) => sum + s.studentFocusScore, 0) /
        overview.recentSessions.length
      : 0;



  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            Welcome, {overview.teacherName}!
          </h1>
          <p className="text-gray-600">Your teaching dashboard for today</p>
        </div>

        <DashboardStats
          todayEarnings={overview.todayEarnings}
          thisMonthEarnings={overview.thisMonthEarnings}
          activeStudents={new Set(upcomingClasses.map((s) => s.studentName)).size}
          avgRating={overview.avgRating}
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeSessions.length > 0 && (
              <ActiveSessions
                sessions={activeSessions}
              />
            )}

            <UpcomingClasses
              upcoming={upcomingClasses}
              onSessionStarted={handleSessionStarted}
            />

            <RecentSessions sessions={overview.recentSessions} />

            <PerformanceAnalytics
              totalUpcoming={upcomingClasses.length}
              avgRating={overview.avgRating}
              avgFocus={avgFocusScore}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CalendarCard availableDays={[]} />
            <EarningsCard
              thisWeek={overview.earningsSummary.thisWeek}
              lastMonth={overview.earningsSummary.lastMonth}
              thisMonth={overview.thisMonthEarnings}
            />
            <TodayOverview
              sessionsToday={overview.todayOverview.sessionsToday}
              hoursTaught={overview.todayOverview.hoursTaught}
              avgFocus={overview.todayOverview.avgFocusScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}