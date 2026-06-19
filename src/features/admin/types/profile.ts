export type AdminProfileData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  gender: string;
  country: string;
  city: string;
};

export type AdminNotifications = {
  emailNotifications: boolean;
  systemAlerts: boolean;
  userReports: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
};

export type PlatformStats = {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalSessions: number;
  monthlyRevenue: string;
  averageRating: number;
};

export type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
