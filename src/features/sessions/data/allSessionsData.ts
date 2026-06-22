export const allSessions = [
  {
    id: 1,
    subject: "Mathematics",
    lessonTitle: "Quadratic Equations and Problem Solving",
    teacher: "Dr. Sarah Johnson",
    teacherInitials: "SJ",
    date: "Nov 5, 2025",
    duration: "1h 30m",
    focusScore: 88,
    status: "completed",
  },
  {
    id: 2,
    subject: "Physics",
    lessonTitle: "Newton's Laws of Motion",
    teacher: "Prof. Michael Chen",
    teacherInitials: "MC",
    date: "Oct 30, 2025",
    duration: "1h 00m",
    focusScore: 76,
    status: "completed",
  },
  {
    id: 3,
    subject: "English",
    lessonTitle: "Shakespeare's Hamlet — Act III Analysis",
    teacher: "Ms. Emily Brown",
    teacherInitials: "EB",
    date: "Oct 25, 2025",
    duration: "1h 15m",
    focusScore: 95,
    status: "completed",
  },
  {
    id: 4,
    subject: "Mathematics",
    lessonTitle: "Trigonometric Identities",
    teacher: "Dr. Sarah Johnson",
    teacherInitials: "SJ",
    date: "Oct 20, 2025",
    duration: "1h 30m",
    focusScore: 82,
    status: "completed",
  },
  {
    id: 5,
    subject: "Chemistry",
    lessonTitle: "Organic Chemistry — Functional Groups",
    teacher: "Dr. Aisha Patel",
    teacherInitials: "AP",
    date: "Oct 15, 2025",
    duration: "1h 00m",
    focusScore: 91,
    status: "completed",
  },
  {
    id: 6,
    subject: "Physics",
    lessonTitle: "Waves and Oscillations",
    teacher: "Prof. Michael Chen",
    teacherInitials: "MC",
    date: "Oct 10, 2025",
    duration: "1h 15m",
    focusScore: 79,
    status: "completed",
  },
  {
    id: 7,
    subject: "Biology",
    lessonTitle: "Cell Division — Mitosis & Meiosis",
    teacher: "Dr. Laura Nguyen",
    teacherInitials: "LN",
    date: "Oct 5, 2025",
    duration: "1h 00m",
    focusScore: 87,
    status: "completed",
  },
  {
    id: 8,
    subject: "English",
    lessonTitle: "Essay Writing — Argumentative Structure",
    teacher: "Ms. Emily Brown",
    teacherInitials: "EB",
    date: "Sep 28, 2025",
    duration: "1h 00m",
    focusScore: 93,
    status: "completed",
  },
  {
    id: 9,
    subject: "Chemistry",
    lessonTitle: "Acid-Base Reactions and pH",
    teacher: "Dr. Aisha Patel",
    teacherInitials: "AP",
    date: "Sep 22, 2025",
    duration: "1h 30m",
    focusScore: 85,
    status: "completed",
  },
  {
    id: 10,
    subject: "Mathematics",
    lessonTitle: "Introduction to Calculus — Limits",
    teacher: "Dr. Sarah Johnson",
    teacherInitials: "SJ",
    date: "Sep 15, 2025",
    duration: "1h 30m",
    focusScore: 90,
    status: "completed",
  },
];

export const subjects = ["All Subjects", "Mathematics", "Physics", "English", "Chemistry", "Biology"];

export function focusColor(score: number) {
  if (score >= 90) return "#22C55E";
  if (score >= 75) return "#3B82F6";
  return "#F59E0B";
}

export function subjectColor(subject: string) {
  const map: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-700",
    Physics: "bg-indigo-100 text-indigo-700",
    English: "bg-purple-100 text-purple-700",
    Chemistry: "bg-green-100 text-green-700",
    Biology: "bg-emerald-100 text-emerald-700",
  };
  return map[subject] || "bg-gray-100 text-gray-700";
}
