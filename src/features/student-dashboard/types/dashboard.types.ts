export interface UpcomingSession {
  id: number;
  teacher: string;
  subject: string;
  time: string;
  duration: string;
  isCurrent: boolean;
}

export interface RecentNote {
  id: number;
  title: string;
  subject: string;
  date: string;
  focusScore: number;
}