import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TeacherOnboarding from "../components/teacher/TeacherOnboarding";

import api from "../../../services/api";
import { useRegister } from "../../../context/register-context";
import type { TeacherOnboardingData } from "../types/onboarding.types";

function mapAvailabilityToApi(av: Record<string, string[]>) {
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const slotMap: Record<string, number> = {
    Morning: 0,
    Afternoon: 1,
    Evening: 2,
    "Morning (6-12)": 0,
    "Afternoon (12-17)": 1,
    "Evening (17-22)": 2,
  };

  return Object.entries(av).flatMap(([day, slots]) =>
    slots.map((slot) => ({
      day: dayMap[day] ?? 0,
      timeSlot: slotMap[slot] ?? 0,
    }))
  );
}

const SUBJECT_MAP: Record<string, number> = {
  "Mathematics": 1,
  "Physics": 2,
  "Computer Science": 3,
  "English Literature": 4,
  "Chemistry": 5,
  "Biology": 6,
  "History": 7
};

export default function TeacherOnboardingPage() {
  const navigate = useNavigate();
  const { payload, reset } = useRegister();
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Redirect safely (after render)
  useEffect(() => {
    if (!isSuccess && (!payload || payload.role !== "teacher")) {
      navigate("/register", { replace: true });
    }
  }, [payload, navigate, isSuccess]);

  // ✅ Don’t render the onboarding while redirecting / missing payload
  if (!isSuccess && (!payload || payload.role !== "teacher")) return null;

  const handleComplete = async (data: TeacherOnboardingData) => {
    try {
      // ✅ Build backend DTO (PascalCase is safest for .NET)
      const requestBody = {
        UserName: data.userName || payload.userName,
        ProfilePhotoURL: data.profileImage ?? payload.profilePhotoURL ?? "",
        FirstName: data.firstName || payload.firstName,
        LastName: data.lastName || payload.lastName,
        Email: data.email ?? payload.email,
        Phone: payload.phone,

        Description: payload.description ?? "",
        Gender: data.gender === "male" ? 0 : 1, // adjust to backend enum

        College: "N/A", // Prototype placeholder
        Certificate: "N/A", // Prototype placeholder
        IdNumber: "000000000", // Prototype placeholder

        SubjectId: SUBJECT_MAP[data.subject] || 1,
        TeachingExperience: data.experience || "0-2",

        Availability: mapAvailabilityToApi(data.availability),
        OpenForImmediate: data.openForImmediate,

        Password: payload.password,
        ConfirmPassword: payload.confirmPassword,
      };

      await api.post("/account/register/teacher", requestBody);

      setIsSuccess(true);
      // ✅ clear context to remove password from memory
      reset();

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err: any) {
      console.error("API ERROR:", err?.response?.data || err?.message);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <TeacherOnboarding onComplete={handleComplete} />
  );
}