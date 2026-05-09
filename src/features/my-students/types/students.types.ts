export interface Student {
  id: number;
  name: string;
  initials: string;
  subject: string;
  totalSessions: number;
  totalHours: number;
  lastSession: string;
  avgFocusScore: number;
  rating: number;
  nextSession: string;
  status: "active" | "inactive";
}