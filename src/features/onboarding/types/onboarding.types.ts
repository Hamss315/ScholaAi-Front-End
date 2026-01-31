export type StudentAvailability = Record<string, string[]>;

export type StudentOnboardingData = {
  firstName: string;
  lastName: string;
  email?: string;

  profileImage: string | null;

  gender: string;
  birthdate: string;

  grade: number | null;

  selectedSubjects: string[];
  sessionDuration: string;

  availability: StudentAvailability;
};

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type AvailabilityMap = Record<WeekDay, string[]>;

export type TeacherExperienceValue = "0-2" | "3-5" | "6-10" | "10+";

export interface TeacherOnboardingData {
  firstName: string;
  lastName: string;
  email?: string;

  profileImage: string | null;

  gender: "" | "male" | "female" | "other" | "prefer-not-to-say";

  biography: string;

  selectedSubjects: string[];
  experience: "" | TeacherExperienceValue;

  certificateFiles: File[];
  idFile: File | null;
  documentsConfirmed: boolean;

  hourlyRate: string;
  availability: AvailabilityMap;
  openForImmediate: boolean;
}
