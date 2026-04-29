import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentOnboarding from "../components/student/StudentOnboarding";

import api from "../../../services/api";
import { useRegister } from "../../../context/register-context";
import type { StudentOnboardingData } from "../types/onboarding.types";

/**
 * Convert UI availability map -> backend array
 * IMPORTANT: adjust mapping to match your UI keys and backend enums.
 */
function mapAvailabilityToApi(av: Record<string, string[]>) {
  const dayMap: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const slotMap: Record<string, number> = {
    Morning: 0,
    Afternoon: 1,
    Evening: 2,
  };

  return Object.entries(av).flatMap(([day, slots]) =>
    slots.map((slot) => ({
      day: dayMap[day] ?? 0,
      timeSlot: slotMap[slot] ?? 0,
    }))
  );
}

export default function StudentOnboardingPage() {
  const navigate = useNavigate();
  const { payload, reset } = useRegister();
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Redirect safely (don’t navigate during render)
  useEffect(() => {
    if (!isSuccess && (!payload || payload.role !== "student")) {
      navigate("/register", { replace: true });
    }
  }, [payload, navigate, isSuccess]);

  if (!isSuccess && (!payload || payload.role !== "student")) return null;

  const handleComplete = async (data: StudentOnboardingData) => {
    try {
      const requestBody = {
        userName: data.userName || payload.userName,
        profilePhotoURL: data.profileImage ?? payload.profilePhotoURL ?? "",
        firstName: data.firstName || payload.firstName,
        lastName: data.lastName || payload.lastName,
        email: data.email ?? payload.email,
        phone: payload.phone,

        grade: data.grade ?? 0,
        description: payload.description ?? "",

        // ⚠️ adjust to your backend enum
        gender: data.gender === "male" ? 0 : 1,

        availability: mapAvailabilityToApi(data.availability),

        password: payload.password,
        confirmPassword: payload.confirmPassword,
      };

      await api.post("/account/register/student", requestBody);

      setIsSuccess(true);
      reset();
      navigate("/login");
    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Only pass onComplete because StudentOnboarding expects only that
  return <StudentOnboarding onComplete={handleComplete} />;
}