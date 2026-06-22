import type { Teacher } from "../types/teacher.types";

export const getTeachers = async (): Promise<Teacher[]> => {
  return [
    {
      userName: "Dr. Sarah Johnson",
      profilePhotoURL: "",
      subject: "Mathematics",
      college: "Calculus College",
      teachingExperience: "10+ years",
    },
    {
      userName: "Prof. Michael Chen",
      profilePhotoURL: "",
      subject: "Physics",
      college: "Physics University",
      teachingExperience: "12+ years",
    }
  ];
};