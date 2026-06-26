import { useEffect, useState } from "react";
import StudentsHeader from "../components/StudentsHeader";
import StudentsStats from "../components/StudentsStats";
import StudentsSearch from "../components/StudentsSearch";
import StudentsSection from "../components/StudentsSection";
import { getMyStudents } from "../../../services/api/teacherProfile";
import { mapStudentCard } from "../../../utils/mapStudent";
import type { Student, StudentsSummary } from "../types/students.types";

const emptySummary: StudentsSummary = {
  totalStudents: 0,
  activeStudents: 0,
  previousStudents: 0,
  totalSessions: 0,
  totalHoursTaught: 0,
  averageRating: 0,
};

export default function MyStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<StudentsSummary>(emptySummary);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [previousStudents, setPreviousStudents] = useState<Student[]>([]);

  // Debounce search input before hitting the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyStudents(debouncedQuery);
        if (cancelled) return;

        if (!res.success) {
          setError("Failed to load students.");
          return;
        }

        setSummary(res.data.summary);
        setActiveStudents(res.data.activeStudents.map(mapStudentCard));
        setPreviousStudents(res.data.previousStudents.map(mapStudentCard));
      } catch {
        if (!cancelled) setError("Failed to load students.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStudents();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentsHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl text-[#1E3A8A] mb-2">My Students</h1>
          <p className="text-gray-600">Students you've taught and their progress</p>
        </div>

        <StudentsStats
          totalStudents={summary.totalStudents}
          activeStudents={summary.activeStudents}
          totalSessions={summary.totalSessions}
          totalHours={summary.totalHoursTaught}
          avgRating={summary.averageRating}
        />

        <StudentsSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading students...</div>
        ) : (
          <>
            <StudentsSection
              title="Active Students"
              students={activeStudents}
              variant="active"
              onNavigate={() => { }}
            />

            {previousStudents.length > 0 && (
              <StudentsSection
                title="Previous Students"
                students={previousStudents}
                variant="inactive"
                onNavigate={() => { }}
              />
            )}

            {!loading &&
              activeStudents.length === 0 &&
              previousStudents.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  {debouncedQuery ? "No students match your search." : "No students yet."}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}