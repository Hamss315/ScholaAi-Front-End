export const sessionData = {
  lessonTitle: "Quadratic Equations and Problem Solving",
  subject: "Mathematics",
  studentLevel: "Intermediate",
  teacherName: "Dr. Sarah Johnson",
  teacherInitials: "SJ",
  studentName: "John Smith",
  studentInitials: "JS",
  date: "Nov 5, 2025",
  duration: "1h 30m",
  totalSeconds: 5400,
};

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
