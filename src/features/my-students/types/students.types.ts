export interface Student {
  id: string;
  name: string;
  initials: string;
  subject: string;
  totalSessions: number;
  totalHours: number;
  avgFocusScore: number | null;
  lastSession: string;
  nextSession: string;
  profilePhotoURL?: string | null;
  status: "active" | "inactive";
}

export interface StudentsSummary {
  totalStudents: number;
  activeStudents: number;
  previousStudents: number;
  totalSessions: number;
  totalHoursTaught: number;
  averageRating: number;
}