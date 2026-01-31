import { useState } from "react";

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

  const workSummary: TeacherWorkSummary = {
    totalHoursTaught: 1247,
    totalEarnings: "$56,115",
    thisMonthEarnings: "$3,420",
    averageRating: 4.9,
    totalReviews: 184,
    completedSessions: 523,
    activeStudents: 28,
  };

  const recentReviews: TeacherReview[] = [
    { id: 1, student: "Emily Parker", rating: 5, comment: "Excellent teacher! Very patient and clear explanations.", date: "Nov 20, 2025" },
    { id: 2, student: "James Wilson", rating: 5, comment: "Best math tutor I've ever had. Highly recommend!", date: "Nov 18, 2025" },
    { id: 3, student: "Sarah Martinez", rating: 4, comment: "Great sessions, very knowledgeable.", date: "Nov 15, 2025" },
  ];

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // later: persist (service/backend)
  };

  const handleSaveProfessional = () => {
    setIsEditingProfessional(false);
    // later: persist (service/backend)
  };

  const handleChangePassword = () => {
    setIsChangingPassword(false);
    // later: call backend
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
            onSaveProfile={handleSaveProfile}
            onSaveProfessional={handleSaveProfessional}
            onChangePassword={handleChangePassword}
          />
        </div>
      </main>
    </div>
  );
}
