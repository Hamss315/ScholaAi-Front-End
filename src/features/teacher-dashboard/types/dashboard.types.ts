export interface ActiveSession {
  id: number;
  student: string;
  subject: string;
  startTime: string;
  focusScore: number;
  status: "good" | "warning" | "bad";
  isCurrent: boolean;
}

export interface UpcomingClass {
  id: number;
  student: string;
  subject: string;
  time: string;
  duration: string;
}