import type { SessionDurationHours, SessionSubject } from "../types/session.types";

export const SESSION_SUBJECTS: readonly SessionSubject[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Economics",
] as const;

export const SESSION_DURATIONS: readonly { value: SessionDurationHours; label: string }[] = [
  { value: 0.5, label: "30 minutes" },
  { value: 1, label: "1 hour" },
  { value: 1.5, label: "1.5 hours" },
  { value: 2, label: "2 hours" },
] as const;
