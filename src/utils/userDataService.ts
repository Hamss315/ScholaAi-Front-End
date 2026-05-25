export interface TeacherProfile {
  id: string;
  fullName: string;
  role: "teacher" | "student";
  availability?: Record<string, string[]>;
}

export const getCurrentUserProfile = (): TeacherProfile | null => {
  return {
    id: "1",
    fullName: "Dr. Roberts",
    role: "teacher",
    availability: {
      "Mon": ["09:00 AM", "10:00 AM"],
      "Tue": ["11:00 AM", "01:00 PM"],
      "Wed": ["10:00 AM"],
      "Thu": ["02:00 PM"],
      "Fri": ["09:00 AM", "03:00 PM"]
    }
  };
};
