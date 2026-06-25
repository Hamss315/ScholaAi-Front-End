// import { useState } from "react";
// import StudentsHeader from "../components/StudentsHeader";
// import StudentsStats from "../components/StudentsStats";
// import StudentsSearch from "../components/StudentsSearch";
// import StudentsSection from "../components/StudentsSection";
// import type { Student } from "../types/students.types";

// export default function MyStudentsPage() {
//   const [searchQuery, setSearchQuery] = useState("");

// const students: Student[] = [
//   {
//     id: 1,
//     name: "Emily Parker",
//     initials: "EP",
//     subject: "Mathematics",
//     totalSessions: 24,
//     totalHours: 36,
//     lastSession: "2 days ago",
//     avgFocusScore: 87,
//     rating: 5,
//     nextSession: "Tomorrow, 1:30 PM",
//     status: "active"
//   },
//   {
//     id: 2,
//     name: "James Wilson",
//     initials: "JW",
//     subject: "Physics",
//     totalSessions: 18,
//     totalHours: 27,
//     lastSession: "5 days ago",
//     avgFocusScore: 93,
//     rating: 5,
//     nextSession: "Friday, 3:00 PM",
//     status: "active"
//   },
//   {
//     id: 3,
//     name: "Sarah Martinez",
//     initials: "SM",
//     subject: "Chemistry",
//     totalSessions: 15,
//     totalHours: 22.5,
//     lastSession: "1 week ago",
//     avgFocusScore: 82,
//     rating: 4,
//     nextSession: "Next Monday, 4:00 PM",
//     status: "active"
//   },
//   {
//     id: 4,
//     name: "David Lee",
//     initials: "DL",
//     subject: "Mathematics",
//     totalSessions: 12,
//     totalHours: 18,
//     lastSession: "3 days ago",
//     avgFocusScore: 90,
//     rating: 5,
//     nextSession: "Thursday, 10:00 AM",
//     status: "active"
//   },
//   {
//     id: 5,
//     name: "Lisa Anderson",
//     initials: "LA",
//     subject: "Biology",
//     totalSessions: 10,
//     totalHours: 15,
//     lastSession: "4 days ago",
//     avgFocusScore: 85,
//     rating: 5,
//     nextSession: "Saturday, 2:00 PM",
//     status: "active"
//   },
//   {
//     id: 6,
//     name: "Michael Chen",
//     initials: "MC",
//     subject: "Physics",
//     totalSessions: 8,
//     totalHours: 12,
//     lastSession: "2 weeks ago",
//     avgFocusScore: 88,
//     rating: 4,
//     nextSession: "Not scheduled",
//     status: "inactive"
//   },
//   {
//     id: 7,
//     name: "Emma Thompson",
//     initials: "ET",
//     subject: "Chemistry",
//     totalSessions: 6,
//     totalHours: 9,
//     lastSession: "1 month ago",
//     avgFocusScore: 91,
//     rating: 5,
//     nextSession: "Not scheduled",
//     status: "inactive"
//   },
//   {
//     id: 8,
//     name: "Omar Hassan",
//     initials: "OH",
//     subject: "Mathematics",
//     totalSessions: 20,
//     totalHours: 30,
//     lastSession: "Yesterday",
//     avgFocusScore: 89,
//     rating: 5,
//     nextSession: "Today, 6:00 PM",
//     status: "active"
//   },
//   {
//     id: 9,
//     name: "Mona Ali",
//     initials: "MA",
//     subject: "Biology",
//     totalSessions: 5,
//     totalHours: 7.5,
//     lastSession: "3 weeks ago",
//     avgFocusScore: 78,
//     rating: 3,
//     nextSession: "Not scheduled",
//     status: "inactive"
//   }
// ];
//   const active = students.filter(s => s.status === "active");
//   const inactive = students.filter(s => s.status === "inactive");

//   const filter = (list: Student[]) =>
//     list.filter(s =>
//       s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       s.subject.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const totalHours = students.reduce((s, x) => s + x.totalHours, 0);
//   const totalSessions = students.reduce((s, x) => s + x.totalSessions, 0);
//   const avgRating = students.reduce((s, x) => s + x.rating, 0) / students.length;

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <StudentsHeader />

//       <div className="container mx-auto px-4 py-8 max-w-7xl">

//         <div className="mb-6">
//           <h1 className="text-4xl text-[#1E3A8A] mb-2">My Students</h1>
//           <p className="text-gray-600">Students you've taught and their progress</p>
//         </div>

//         <StudentsStats
//           totalStudents={students.length}
//           activeStudents={active.length}
//           totalSessions={totalSessions}
//           totalHours={totalHours}
//           avgRating={avgRating}
//         />

//         <StudentsSearch
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//         />

//         <StudentsSection
//           title="Active Students"
//           students={filter(active)}
//           variant="active"
//           onNavigate={() => {}}
//         />

//         {inactive.length > 0 && (
//           <StudentsSection
//             title="Previous Students"
//             students={filter(inactive)}
//             variant="inactive"
//             onNavigate={() => {}}
//           />
//         )}

//       </div>
//     </div>
//   );
// }
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