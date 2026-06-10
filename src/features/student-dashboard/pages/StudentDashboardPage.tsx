// import { useEffect, useState, useCallback, useRef } from "react";
// import DashboardHeader from "../components/DashboardHeader";
// import StatsGrid from "../components/StatsGrid";
// import UpcomingSessions from "../components/UpcomingSessions";
// import StudentActiveSessions from "../components/ActiveSessions";
// import RecentSessions from "../components/RecentSessions";
// import RightSidebar from "../components/RightSidebar";

// import {
//   getStudentDashboardData,
//   type StudentDashboardData,
// } from "../../../services/api/studentDashboard";
// import type { UpcomingSession, ActiveSession } from "../types/dashboard.types";

// const POLL_MS = 30_000; // 30 seconds
// const STORAGE_KEY = "student_upcoming_sessions";

// const EMPTY: StudentDashboardData = {
//   studentName: "Student",
//   avgFocusScore: 0,
//   sessionsThisMonth: 0,
//   walletBalance: 0,
//   upcomingSessions: [],
//   activeSessions: [],
//   recentSessions: [],
// };

// // ─── localStorage helpers ────────────────────────────────────────────────────

// function readStorage(): UpcomingSession[] {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return [];
//     const parsed: UpcomingSession[] = JSON.parse(raw);
//     const now = Date.now();
//     // Discard sessions more than 2 hours past their scheduled time
//     return parsed.filter((s) => {
//       const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
//       return minsAfter < 120;
//     });
//   } catch {
//     return [];
//   }
// }

// function writeStorage(sessions: UpcomingSession[]) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
//   } catch {}
// }

// // ─────────────────────────────────────────────────────────────────────────────

// export default function StudentDashboardPage() {
//   const [data, setData] = useState<StudentDashboardData>(EMPTY);
//   const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
//     () => readStorage()
//   );
//   const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

//   // IDs that are now in activeSessions — don't show them in upcoming too
//   const activeIds = useRef<Set<number>>(new Set());

//   /**
//    * Merge API upcoming sessions with localStorage.
//    * Sessions the backend no longer returns (because time passed) are kept
//    * visible until they move to activeSessions or expire (2h window).
//    */
//   const merge = useCallback((apiSessions: UpcomingSession[], currentActive: ActiveSession[]): UpcomingSession[] => {
//     const stored = readStorage();
//     const now = Date.now();
//     const apiIds = new Set(apiSessions.map((s) => s.id));
//     const liveIds = new Set(currentActive.map((s) => s.id));

//     const retained = stored.filter((s) => {
//       if (apiIds.has(s.id)) return false;   // API still has it — no duplicate
//       if (liveIds.has(s.id)) return false;  // session is now active — move it out of upcoming
//       const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
//       return minsAfter < 120;               // drop after 2 hours
//     });

//     const merged = [...apiSessions, ...retained];
//     writeStorage(merged);
//     return merged;
//   }, []);

//   const load = useCallback(async () => {
//     const fresh = await getStudentDashboardData();

//     // Update active session IDs ref
//     activeIds.current = new Set(fresh.activeSessions.map((s) => s.id));

//     setActiveSessions(fresh.activeSessions);
//     setUpcomingSessions(merge(fresh.upcomingSessions, fresh.activeSessions));
//     setData(fresh);
//   }, [merge]);

//   useEffect(() => {
//     load();
//     const interval = setInterval(load, POLL_MS);
//     return () => clearInterval(interval);
//   }, [load]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardHeader />

//       <div className="container mx-auto px-4 py-8">
//         {/* Welcome */}
//         <div className="mb-8">
//           <h1 className="text-4xl mb-2 text-[#1E3A8A]">
//             Welcome back, {data.studentName}!
//           </h1>
//           <p className="text-gray-600">Here's your learning overview for today</p>
//         </div>

//         {/* Stats */}
//         <StatsGrid />

//         {/* Active Sessions — appears automatically when teacher starts a session */}
//         {activeSessions.length > 0 && (
//           <div className="mb-6">
//             <StudentActiveSessions sessions={activeSessions} />
//           </div>
//         )}

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">
//             <UpcomingSessions sessions={upcomingSessions} />
//             <RecentSessions sessions={data.recentSessions} />
//           </div>

//           {/* RIGHT */}
//           <RightSidebar />
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useCallback, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatsGrid from "../components/StatsGrid";
import UpcomingSessions from "../components/UpcomingSessions";
import StudentActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import RightSidebar from "../components/RightSidebar";

import {
  getStudentDashboardData,
  type StudentDashboardData,
} from "../../../services/api/studentDashboard";
import type { UpcomingSession, ActiveSession } from "../types/dashboard.types";

const POLL_MS = 30_000;
const STORAGE_KEY = "student_upcoming_sessions";

const EMPTY: StudentDashboardData = {
  studentName: "Student",
  avgFocusScore: 0,
  sessionsThisMonth: 0,
  walletBalance: 0,
  upcomingSessions: [],
  activeSessions: [],
  recentSessions: [],
};

function readStorage(): UpcomingSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: UpcomingSession[] = JSON.parse(raw);
    const now = Date.now();
    return parsed.filter((s) => {
      const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
      return minsAfter < 120;
    });
  } catch {
    return [];
  }
}

function writeStorage(sessions: UpcomingSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch { }
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData>(EMPTY);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    () => readStorage()
  );
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const activeIds = useRef<Set<number>>(new Set());

  const merge = useCallback(
    (apiSessions: UpcomingSession[], currentActive: ActiveSession[]): UpcomingSession[] => {
      const stored = readStorage();
      const now = Date.now();
      const apiIds = new Set(apiSessions.map((s) => s.id));
      const liveIds = new Set(currentActive.map((s) => s.id));

      const retained = stored.filter((s) => {
        if (apiIds.has(s.id)) return false;
        if (liveIds.has(s.id)) return false;
        const minsAfter = (now - new Date(s.scheduledAt).getTime()) / 60000;
        return minsAfter < 120;
      });

      const merged = [...apiSessions, ...retained];
      writeStorage(merged);
      return merged;
    },
    []
  );

  const load = useCallback(async () => {
    const fresh = await getStudentDashboardData();
    activeIds.current = new Set(fresh.activeSessions.map((s) => s.id));
    setActiveSessions(fresh.activeSessions);
    setUpcomingSessions(merge(fresh.upcomingSessions, fresh.activeSessions));
    setData(fresh);
  }, [merge]);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#1E3A8A]">
            Welcome back, {data.studentName}!
          </h1>
          <p className="text-gray-600">Here's your learning overview for today</p>
        </div>

        <StatsGrid />

        {/* ── ActiveSessions is now INSIDE the left column, same width as the rest ── */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {activeSessions.length > 0 && (
              <StudentActiveSessions sessions={activeSessions} />
            )}
            <UpcomingSessions sessions={upcomingSessions} />
            <RecentSessions sessions={data.recentSessions} />
          </div>

          {/* RIGHT */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}