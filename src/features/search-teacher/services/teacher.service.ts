import type { Teacher } from "../types/teacher.types";

export const getTeachers = async (): Promise<Teacher[]> => {
  return [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "SJ",
      subjects: ["Mathematics", "Calculus"],
      rating: 4.9,
      reviews: 184,
      hourlyRate: 45,
      experience: "10+ years",
      bio: "Passionate educator specializing in making complex math concepts easy to understand.",
      availability: ["Morning", "Afternoon", "Evening"],
      students: 28
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      avatar: "MC",
      subjects: ["Physics", "Mathematics"],
      rating: 4.8,
      reviews: 156,
      hourlyRate: 50,
      experience: "12+ years",
      bio: "Physics expert with a focus on practical applications and real-world examples.",
      availability: ["Morning", "Evening", "Night"],
      students: 35
    }
  ];
};