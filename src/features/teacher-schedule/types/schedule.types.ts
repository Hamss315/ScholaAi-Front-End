export type Availability = Record<string, string[]>;

export interface TeacherProfile {
  fullName: string;
  role: "teacher";
  availability?: Availability;
}