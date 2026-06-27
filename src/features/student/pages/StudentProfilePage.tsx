import { useEffect, useState } from "react";

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

import { getStudentProfile, type UpdateStudentProfileDto } from "../services/studentProfile.service";
import { updateStudentProfile } from "../services/studentProfile.service";
import { changeStudentPassword } from "../services/studentProfile.service";
import { mapStudentProfileDto } from "../services/studentProfile.mapper";
import { getUserIdFromToken } from "../../../utils/jwt";

export default function StudentProfilePage() {
  const resolveUserId = () => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return storedUserId;

    const token = localStorage.getItem("token") || localStorage.getItem("scholaai_token");
    if (!token) return "";

    const idFromToken = getUserIdFromToken(token);
    if (idFromToken) {
      localStorage.setItem("userId", idFromToken);
    }

    return idFromToken;
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");


  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");

  const [profileError, setProfileError] = useState<string>("");
  const [profileSuccess, setProfileSuccess] = useState<string>("");

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    grade: "",
    bio: "",
    gender: "",
    country: "",
    city: "",
    subjects: [],
    sessionDuration: "",
  });

  const [notifications, setNotifications] = useState<NotificationsSettings>({
    emailNotifications: true,
    sessionReminders: true,
    promotionalEmails: false,
    weeklyReports: true,
  });

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    balance: 0,
    lastTopUp: new Date(),
    status: "Active",
    currency: "USD",
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentItem[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSessions: 0,
    totalHours: 0,
    averageFocus: 0,
    completedThisMonth: 0,
  });

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const userId = resolveUserId();
        if (!userId) {
          setError("Missing userId. Please login again.");
          return;
        }

        const dto = await getStudentProfile(userId);
        const mapped = mapStudentProfileDto(dto);

        setProfileData(mapped.profileData);
        setSessionStats(mapped.sessionStats);
        setSubscriptionData(mapped.subscriptionData);
        setPaymentHistory(mapped.paymentHistory);
      } catch (e: any) {
        console.error(e?.response?.data || e?.message);
        setError("Failed to load profile from server.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setProfileError("");       // ✅
      setProfileSuccess("");     // ✅
      const userId = resolveUserId();
      if (!userId) return;

      const gradeNumber = profileData.grade
        ? parseInt(profileData.grade.replace("Grade ", ""), 10)
        : undefined;

      const dto: UpdateStudentProfileDto = {
        firstName: profileData.firstName || undefined,
        lastName: profileData.lastName || undefined,
        phone: profileData.phone || undefined,
        description: profileData.bio || undefined,
        grade: gradeNumber && !isNaN(gradeNumber) ? gradeNumber : undefined,
      };

      await updateStudentProfile(userId, dto);
      setProfileSuccess("Profile updated successfully!");  // ✅
      setIsEditingProfile(false);
    } catch (e: any) {
      const data = e?.response?.data;
      setProfileError(                                     // ✅
        data?.errors ? JSON.stringify(data) : data?.message ?? e.message ?? "Failed to save."
      );
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");
      setPasswordSuccess("");

      // ✅ frontend validation
      const { newPassword, confirmPassword, currentPassword } = passwordData;

      if (!currentPassword) {
        setPasswordError("Current password is required.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters.");
        return;
      }
      if (!/[A-Z]/.test(newPassword)) {
        setPasswordError("New password must contain at least one uppercase letter.");
        return;
      }
      if (!/[a-z]/.test(newPassword)) {
        setPasswordError("New password must contain at least one lowercase letter.");
        return;
      }
      if (!/[^a-zA-Z0-9]/.test(newPassword)) {
        setPasswordError("New password must contain at least one special character (e.g. @, #, !).");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      const userId = resolveUserId();
      if (!userId) return;

      const message = await changeStudentPassword(userId, passwordData);
      setPasswordSuccess(message);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      const data = e?.response?.data;

      if (typeof data === "string") {
        setPasswordError(data);
      } else if (data?.errors) {
        // extract first error message from each field and join them
        const messages = Object.values(data.errors as Record<string, string[]>)
          .flat()
          .join(" • ");
        setPasswordError(messages);
      } else {
        setPasswordError(data?.message ?? e.message ?? "Failed to change password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* If your header needs profile data, pass it like this:
          <StudentProfileHeader profileData={profileData} />
          If not, keep it as-is. */}
      <StudentProfileHeader profileData={profileData} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {loading && <p className="text-gray-600">Loading profile...</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
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
              paymentHistory={paymentHistory}
              sessionStats={sessionStats}
              onSaveProfile={handleSaveProfile}
              onChangePassword={handleChangePassword}
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              passwordError={passwordError}
              passwordSuccess={passwordSuccess}
              profileError={profileError}
              profileSuccess={profileSuccess}
            />
          </div>
        )}
      </main>
    </div>
  );
}
