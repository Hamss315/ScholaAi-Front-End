import { useState } from "react";

import AdminProfileHeader from "../components/AdminProfileHeader";
import AdminProfileSidebar from "../components/AdminProfileSidebar";
import AdminProfileTabs from "../components/AdminProfileTabs";

import type {
  AdminProfileData,
  AdminNotifications,
  PlatformStats,
  PasswordData,
} from "../types/profile";

const defaultPlatformStats: PlatformStats = {
  totalUsers: 1248,
  totalTeachers: 342,
  totalStudents: 906,
  totalSessions: 8456,
  monthlyRevenue: "$45,280",
  averageRating: 4.8,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState<AdminProfileData>({
    name: "Admin User",
    email: "admin@scholaai.com",
    phone: "+1 (555) 123-4567",
    role: "Platform Administrator",
    location: "San Francisco, CA",
    gender: "Male",
    country: "United States",
    city: "San Francisco",
  });

  const [notifications, setNotifications] = useState<AdminNotifications>({
    emailNotifications: true,
    systemAlerts: true,
    userReports: true,
    securityAlerts: true,
    weeklyReports: true,
  });

  const [language, setLanguage] = useState("en");

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const initials = getInitials(profileData.name);

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // TODO: wire to admin profile API when available
  };

  const handleChangePassword = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    // TODO: wire to admin password API when available
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminProfileHeader initials={initials} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            Admin Profile
          </h1>
          <p className="text-gray-600">
            Manage your administrator account and platform settings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <AdminProfileSidebar
            profileData={profileData}
            platformStats={defaultPlatformStats}
            initials={initials}
          />

          <AdminProfileTabs
            profileData={profileData}
            setProfileData={setProfileData}
            notifications={notifications}
            setNotifications={setNotifications}
            language={language}
            setLanguage={setLanguage}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onSaveProfile={handleSaveProfile}
            onChangePassword={handleChangePassword}
          />
        </div>
      </main>
    </div>
  );
}
