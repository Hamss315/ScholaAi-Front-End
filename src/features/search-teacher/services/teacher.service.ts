import type { Teacher } from "../types/teacher.types";

export const getTeachers = async (): Promise<Teacher[]> => {
  return [
    {
      userName: "Dr. Sarah Johnson",
      subject: "Mathematics",
      college: "MIT",
      teachingExperience: "10+ years",
      profilePhotoURL: ""
    },
    {
      userName: "Prof. Michael Chen",
      subject: "Physics",
      college: "Stanford",
      teachingExperience: "12+ years",
      profilePhotoURL: ""
    }
  ];
};