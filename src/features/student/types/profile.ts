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
  sessionDuration: string;
};

export type NotificationsSettings = {
  emailNotifications: boolean;
  sessionReminders: boolean;
  promotionalEmails: boolean;
  weeklyReports: boolean;
};

export type SubscriptionData = {
  lastTopUp: Date;
  balance: number;
  status: string;
  currency: string;
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
