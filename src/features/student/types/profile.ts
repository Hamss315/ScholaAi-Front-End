export type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  grade: string;
  bio: string;
  gender: string;
  country: string;
  city: string;
  subjects: string[];
  learningStyle: string;
  sessionDuration: string;
};

export type NotificationsSettings = {
  emailNotifications: boolean;
  sessionReminders: boolean;
  promotionalEmails: boolean;
  weeklyReports: boolean;
};

export type SubscriptionData = {
  plan: string;
  hoursRemaining: number;
  renewalDate: string;
  status: string;
  monthlyHours: number;
};

export type PaymentItem = {
  id: number;
  date: string;
  amount: string;
  plan: string;
  status: string;
};

export type SessionStats = {
  totalSessions: number;
  totalHours: number;
  averageFocus: number;
  completedThisMonth: number;
};
