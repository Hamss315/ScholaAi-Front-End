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
import { getTeacherRatings } from "../../../services/api/rating";

export default function TeacherProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ✅ MATCHES TeacherProfileData
  const [profileData, setProfileData] = useState<TeacherProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });

  // ✅ MATCHES TeacherProfessionalData
  const [professionalData, setProfessionalData] = useState<TeacherProfessionalData>({
    subjects: [],
    experience: "",
    education: "",
    specializations: "",
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
    totalEarnings: "0 EGP",
    thisMonthEarnings: "0 EGP",
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
        console.log("API DATA:", data);

        // ✅ PROFILE (aligned with your type)
        setProfileData({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          bio: data.description ?? "", // backend → frontend mapping
          location: "", // will work if backend adds it later
        });

        // ✅ SUBJECTS SAFE CONVERSION
        let subjects: string[] = [];

        if (Array.isArray(data.subjects)) {
          subjects = data.subjects;
        } else if (typeof data.subjects === "string") {
          subjects = data.subjects.split(",").map((s: string) => s.trim());
        }

        // ✅ PROFESSIONAL (aligned with your type)
        setProfessionalData({
          subjects,
          experience: data.teachingExperience ?? "",
          education: data.college ?? "",
          specializations: data.certificate ?? "",
        });

        setWorkSummary((prev) => ({
          ...prev,
          totalHoursTaught: data.totalHoursTaught ?? 0,
          totalEarnings: "0 EGP",
          thisMonthEarnings: "0 EGP",
          averageRating: data.averageRate ?? prev.averageRating,
          totalReviews: data.totalRatings ?? prev.totalReviews,
          completedSessions: data.totalSessions ?? 0,
          activeStudents: 0,
        }));
      } catch (err: any) {
        console.error(err);
        setError("Failed to load teacher profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [reviewsList, setReviewsList] = useState<TeacherReview[]>([]);

  useEffect(() => {
    const teacherId = localStorage.getItem("userId");
    if (!teacherId) return;

    console.log("Fetching ratings for teacherId:", teacherId);

    (async () => {
      try {
        const res = await getTeacherRatings(teacherId);
        console.log("Ratings API response:", res);

        // Support two common response shapes:
        // 1) { success, totalRatings, data: RatingDto[] }
        // 2) RatingDto[] (backend returns array directly)
        const dataArray: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const reviews: TeacherReview[] = (dataArray ?? []).map((r) => ({
          id: r.ratingId,
          student: r.studentName
            ? r.studentName
            : r.studentId
            ? `Student #${r.studentId.slice(0, 6)}`
            : "Anonymous",
          rating: r.ratingValue,
          comment: r.comment ?? "",
          date: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

        setReviewsList(reviews);

        const total = reviews.length;
        const avg =
          total > 0
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
            : 0;

        setWorkSummary((prev) => ({
          ...prev,
          averageRating: avg,
          totalReviews: total,
        }));
      } catch (err) {
        console.error("Failed to load teacher reviews:", err);
      }
    })();
  }, []);

  // ✅ SAVE PROFILE (aligned with backend DTO)
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

  // ✅ SAVE PROFESSIONAL (keep backend compatibility)
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
        const messages = Object.values(data.errors).flat().join(" • ");
        setPasswordError(messages);
      } else {
        setPasswordError(data?.message || e.message || "Failed to change password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherProfileHeader profileData={profileData} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your teaching profile and professional information
          </p>
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
              recentReviews={reviewsList}
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