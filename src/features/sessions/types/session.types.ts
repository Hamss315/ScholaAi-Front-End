export type SessionDurationHours = 0.5 | 1 | 1.5 | 2;

export type SessionSubject =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "English"
  | "History"
  | "Computer Science"
  | "Economics";

export interface SessionRequestFormData {
  subject: SessionSubject | "";
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm
  durationHours: SessionDurationHours;
  notes: string;
}

// ####### Teacher Side #######

export type SessionRequestStatus = "pending" | "accepted" | "declined";

export interface SessionRequest {
  id: number;
  studentName: string;
  studentInitials: string;
  subject: string;
  preferredDate: string;
  preferredTime: string;
  duration: string;
  notes?: string;
  requestedDate: string;
  status: SessionRequestStatus;
}