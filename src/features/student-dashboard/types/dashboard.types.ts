export interface UpcomingSession {
  id: number;
  teacherName: string;
  subjectName: string;
  scheduledAt: string;
}

export interface ActiveSession {
  id: number;
  teacherName: string;
  subjectName: string;
  scheduledAt: string;
  focusScore?: number;
}

export interface RecentSession {
  id: number;
  teacherName: string;
  subjectName: string;
  scheduledAt: string;
  focusScore: number;
}

// kept for backward compat if anything still references it
export interface RecentNote {
  id: number;
  title: string;
  subject: string;
  date: string;
  focusScore: number;
}