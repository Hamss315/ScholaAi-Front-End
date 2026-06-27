import { useState, useCallback } from "react";
import { Video } from "lucide-react";
import AllSessionsHeader from "../components/all-sessions/AllSessionsHeader";
import AllSessionsStats from "../components/all-sessions/AllSessionsStats";
import AllSessionsContent from "../components/all-sessions/AllSessionsContent";
import { getSubjects } from "../../../services/api/admin";
import { useEffect } from "react";

export default function AllSessionsPage() {
  // Subjects for the filter dropdown — fetched from the backend
  const [subjectNames, setSubjectNames] = useState<string[]>(["All Subjects"]);

  useEffect(() => {
    getSubjects()
      .then((res) => {
        const names = (res.data ?? []).map((s) => s.name);
        setSubjectNames(["All Subjects", ...names]);
      })
      .catch(() => {});
  }, []);

  // Stats derived from the real sessions returned by the backend
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgFocusScore: null as number | null,
    subjectsCovered: 0,
  });

  const handleSessionsLoaded = useCallback((sessions: any[]) => {
    const total = sessions.length;

    const withFocus = sessions.filter(
      (s) => s.focusScore != null && s.focusScore > 0
    );
    const avgFocus =
      withFocus.length > 0
        ? Math.round(
            withFocus.reduce((sum, s) => sum + s.focusScore, 0) /
              withFocus.length
          )
        : null;

    const uniqueSubjects = new Set(
      sessions.map((s) => s.subject).filter(Boolean)
    );

    setStats({
      totalSessions: total,
      avgFocusScore: avgFocus,
      subjectsCovered: uniqueSubjects.size,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AllSessionsHeader />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-8 h-8" style={{ color: "#3B82F6" }} />
            <h1 className="text-4xl" style={{ color: "#1E3A8A" }}>
              All Sessions
            </h1>
          </div>
          <p className="text-gray-600">
            Browse your complete session history, view recordings, and access
            AI-generated notes.
          </p>
        </div>

        <AllSessionsStats
          totalSessions={stats.totalSessions}
          avgFocusScore={stats.avgFocusScore}
          subjectsCovered={stats.subjectsCovered}
        />

        <AllSessionsContent
          subjects={subjectNames}
          onSessionsLoaded={handleSessionsLoaded}
        />
      </div>
    </div>
  );
}
