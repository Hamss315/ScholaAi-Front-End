export type SessionStatus = "upcoming" | "completed" | "pending";

/* ===================== STUDENT ===================== */
export interface StudentSession {
  id: number;
  date: string;
  teacher: string;
  subject: string;
  time: string;
  duration: string;
  status: SessionStatus;
  focusScore?: number;
}

/* ===================== TEACHER ===================== */
export interface TeacherSession {
  id: number;
  date: string;
  student: string;
  subject: string;
  time: string;
  duration: string;
  status: SessionStatus;
  focusScore?: number;
}