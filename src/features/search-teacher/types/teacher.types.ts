export interface Teacher {
  userId?: string;
  teacherId?: string;
  id?: string;
  userName: string;
  subject: string;
  college: string;
  teachingExperience: string;
  profilePhotoURL?: string;
  rating?: number;
  totalRatings?: number;
}