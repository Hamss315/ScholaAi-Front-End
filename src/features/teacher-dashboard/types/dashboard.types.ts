export interface ActiveSession {
  id: number;
  studentName: string;
  subjectName: string;
  scheduledAt: string;
  studentFocusScore?: number;
}

export interface UpcomingClass {
  id: number;
  requestId: number;
  studentName: string;
  subjectName: string;
  scheduledAt: string;
}

export interface RecentSession {
  id: number;
  studentName: string;
  subjectName: string;
  scheduledAt: string;
  studentFocusScore: number;
}