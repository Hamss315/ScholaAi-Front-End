export type TeacherProfilePageProps = {
  onNavigate: (page: string) => void;
};

export type TeacherProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
};

export type TeacherProfessionalData = {
  subjects: string[];
  experience: string;
  hourlyRate: string;
  education: string;
  specializations: string;
};

export type TeacherCertification = {
  id: number;
  name: string;
  issuer: string;
  year: string;
};

export type TeacherNotifications = {
  emailNotifications: boolean;
  sessionReminders: boolean;
  studentRequests: boolean;
  weeklyReports: boolean;
};

export type TeacherWorkSummary = {
  totalHoursTaught: number;
  totalEarnings: string;
  thisMonthEarnings: string;
  averageRating: number;
  totalReviews: number;
  completedSessions: number;
  activeStudents: number;
};

export type TeacherReview = {
  id: number;
  student: string;
  rating: number;
  comment: string;
  date: string;
};
