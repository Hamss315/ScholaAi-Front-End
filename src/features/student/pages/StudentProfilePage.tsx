import { useState } from "react";

import StudentProfileHeader from "../components/StudentProfileHeader";
import StudentProfileSidebar from "../components/StudentProfileSidebar";
import StudentProfileTabs from "../components/StudentProfileTabs";

import type {
  ProfileData,
  NotificationsSettings,
  SubscriptionData,
  PaymentItem,
  SessionStats,
} from "../types/profile";

export default function StudentProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    grade: "Grade 10",
    bio: "Passionate about learning mathematics and science. Looking to improve my grades and understanding.",
    gender: "Male",
    country: "Egypt",
    city: "Cairo",
    subjects: ["Math", "Physics"],
    learningStyle: "Visual",
    sessionDuration: "45",
  });

  const [notifications, setNotifications] = useState<NotificationsSettings>({
    emailNotifications: true,
    sessionReminders: true,
    promotionalEmails: false,
    weeklyReports: true,
  });

  const [language, setLanguage] = useState("en");

  const subscriptionData: SubscriptionData = {
    plan: "Premium Plan",
    hoursRemaining: 12.5,
    renewalDate: "December 15, 2025",
    status: "Active",
    monthlyHours: 20,
  };

  const paymentHistory: PaymentItem[] = [
    { id: 1, date: "Nov 15, 2025", amount: "$79.99", plan: "Premium - 20 Hours", status: "Completed" },
    { id: 2, date: "Oct 15, 2025", amount: "$79.99", plan: "Premium - 20 Hours", status: "Completed" },
    { id: 3, date: "Sep 15, 2025", amount: "$49.99", plan: "Basic - 10 Hours", status: "Completed" },
  ];

  const sessionStats: SessionStats = {
    totalSessions: 48,
    totalHours: 72.5,
    averageFocus: 91,
    completedThisMonth: 12,
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // later: persist (service/backend)
  };

  const handleChangePassword = () => {
    setIsChangingPassword(false);
    // later: call backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentProfileHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StudentProfileSidebar
            profileData={profileData}
            sessionStats={sessionStats}
            subscriptionData={subscriptionData}
          />

          <StudentProfileTabs
            profileData={profileData}
            setProfileData={setProfileData}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            notifications={notifications}
            setNotifications={setNotifications}
            language={language}
            setLanguage={setLanguage}
            paymentHistory={paymentHistory}
            sessionStats={sessionStats}
            onSaveProfile={handleSaveProfile}
            onChangePassword={handleChangePassword}
          />
        </div>
      </main>
    </div>
  );
}
