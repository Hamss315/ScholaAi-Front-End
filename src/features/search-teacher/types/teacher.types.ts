export interface Teacher {
  id: number;
  name: string;
  avatar: string;
  subjects: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  experience: string;
  bio: string;
  availability: ("Morning" | "Afternoon" | "Evening" | "Night")[];
  students: number;
}