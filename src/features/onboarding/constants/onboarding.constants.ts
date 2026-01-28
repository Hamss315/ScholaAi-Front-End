export const STUDENT_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Spanish",
  "French",
  "Economics",
] as const;

export const STUDENT_SESSION_DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
] as const;

export const STUDENT_GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const grade = i + 1;
  return { value: grade, label: `Grade ${grade}` };
}) as ReadonlyArray<{ value: number; label: string }>;

export const STUDENT_WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const STUDENT_TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;


// ===== Teacher constants =====

export const TEACHER_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Spanish",
  "French",
  "Economics",
  "Business",
  "Psychology",
] as const;

export const TEACHER_EXPERIENCE_LEVELS = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10+", label: "10+ years" },
] as const;

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const TEACHER_TIME_SLOTS = [
  "Morning (6-12)",
  "Afternoon (12-17)",
  "Evening (17-22)",
] as const;
