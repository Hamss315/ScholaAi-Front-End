import { useState, useEffect } from "react";

import TeacherProfileHeader from "../components/TeacherProfileHeader";
import TeacherProfileSidebar from "../components/TeacherProfileSidebar";
import TeacherProfileTabs from "../components/TeacherProfileTabs";

import type {
  TeacherProfileData,
  TeacherProfessionalData,
  TeacherCertification,
  TeacherNotifications,
  TeacherWorkSummary,
  TeacherReview,
} from "../types/profile";

import {
  getTeacherProfile,
  updateTeacherProfile,
  changeTeacherPassword,
} from "../services/teacherProfile.service";
import type { UpdateTeacherProfileDto } from "../services/teacherProfile.service";

export default function TeacherProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState<TeacherProfileData>({
    firstName: "Dr Sarah",
    lastName: "Roberts",
    email: "sarah.roberts@example.com",
    phone: "+1 (555) 987-6543",
    bio: "Passionate educator with 10+ years of experience in mathematics and physics. Specialized in making complex concepts easy to understand.",
    location: "Boston, MA",
  });

  const [professionalData, setProfessionalData] = useState<TeacherProfessionalData>({
    subjects: ["Mathematics", "Physics", "Calculus"],
    experience: "10+ years",
    hourlyRate: "$45",
    education: "Ph.D. in Mathematics, MIT",
    specializations: "Algebra, Calculus, Quantum Physics",
  });

  const certifications: TeacherCertification[] = [
    { id: 1, name: "Advanced Teaching Certification", issuer: "Education Board", year: "2020" },
    { id: 2, name: "Online Education Specialist", issuer: "Digital Learning Institute", year: "2021" },
    { id: 3, name: "STEM Education Excellence", issuer: "National STEM Council", year: "2022" },
  ];

  const [notifications, setNotifications] = useState<TeacherNotifications>({
    emailNotifications: true,
    sessionReminders: true,
    studentRequests: true,
    weeklyReports: true,
  });

  const [language, setLanguage] = useState("en");

  const [workSummary, setWorkSummary] = useState<TeacherWorkSummary>({
    totalHoursTaught: 0,
    totalEarnings: "$0",
    thisMonthEarnings: "$0",
    averageRating: 0,
    totalReviews: 0,
    completedSessions: 0,
    activeStudents: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User ID missing. Please log in again.");
          return;
        }

        const data = await getTeacherProfile(userId);
        
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.description || "",
          location: "", // Backend does not have location
        });

        setProfessionalData({
          subjects: [], // Backend does not have an array of subjects for profile dto yet
          experience: data.teachingExperience || "",
          hourlyRate: "", // Backend does not have hourlyRate
          education: data.college || "",
          specializations: data.certificate || "", // using certificate as specializations 
        });

        setWorkSummary({
          totalHoursTaught: data.totalHoursTaught || 0,
          totalEarnings: "$0",
          thisMonthEarnings: "$0",
          averageRating: data.averageRate || 0,
          totalReviews: 0,
          completedSessions: data.totalSessions || 0,
          activeStudents: 0,
        });

      } catch (err: any) {
        console.error(err);
        setError("Failed to load teacher profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const recentReviews: TeacherReview[] = [
    { id: 1, student: "Emily Parker", rating: 5, comment: "Excellent teacher! Very patient and clear explanations.", date: "Nov 20, 2025" },
    { id: 2, student: "James Wilson", rating: 5, comment: "Best math tutor I've ever had. Highly recommend!", date: "Nov 18, 2025" },
    { id: 3, student: "Sarah Martinez", rating: 4, comment: "Great sessions, very knowledgeable.", date: "Nov 15, 2025" },
  ];

  const handleSaveProfile = async () => {
    try {
      setProfileError("");
      setProfileSuccess("");
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const dto: UpdateTeacherProfileDto = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        description: profileData.bio,
      };

      await updateTeacherProfile(userId, dto);
      setProfileSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (e: any) {
      setProfileError(e?.response?.data?.message || e.message || "Failed to update profile.");
    }
  };

  const handleSaveProfessional = async () => {
    try {
      setProfileError("");
      setProfileSuccess("");
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const dto: UpdateTeacherProfileDto = {
        college: professionalData.education,
        certificate: professionalData.specializations,
        teachingExperience: professionalData.experience,
      };

      await updateTeacherProfile(userId, dto);
      setProfileSuccess("Professional details updated successfully!");
      setIsEditingProfessional(false);
    } catch (e: any) {
      setProfileError(e?.response?.data?.message || e.message || "Failed to update professional details.");
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");
      setPasswordSuccess("");

      const { newPassword, confirmPassword, currentPassword } = passwordData;

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All fields are required.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      await changeTeacherPassword(userId, passwordData);
      setPasswordSuccess("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      const data = e?.response?.data;
      if (typeof data === "string") setPasswordError(data);
      else if (data?.errors) {
        const messages = Object.values(data.errors as Record<string, string[]>).flat().join(" • ");
        setPasswordError(messages);
      } else {
        setPasswordError(data?.message || e.message || "Failed to change password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherProfileHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            My Profile
          </h1>
          <p className="text-gray-600">Manage your teaching profile and professional information</p>
        </div>

        {loading && <p className="text-gray-600">Loading profile...</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-6">
          <TeacherProfileSidebar
            profileData={profileData}
            professionalData={professionalData}
            workSummary={workSummary}
          />

          <TeacherProfileTabs
            profileData={profileData}
            setProfileData={setProfileData}
            professionalData={professionalData}
            setProfessionalData={setProfessionalData}
            certifications={certifications}
            workSummary={workSummary}
            recentReviews={recentReviews}
            notifications={notifications}
            setNotifications={setNotifications}
            language={language}
            setLanguage={setLanguage}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            isEditingProfessional={isEditingProfessional}
            setIsEditingProfessional={setIsEditingProfessional}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            passwordError={passwordError}
            passwordSuccess={passwordSuccess}
            profileError={profileError}
            profileSuccess={profileSuccess}
            onSaveProfile={handleSaveProfile}
            onSaveProfessional={handleSaveProfessional}
            onChangePassword={handleChangePassword}
          />
        </div>
        )}
      </main>
    </div>
  );
}
