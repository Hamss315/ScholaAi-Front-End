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
      Day: dayMap[day] ?? 0,
      TimeSlot: slotMap[slot] ?? 0,
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
    if (!payload) return;
    try {
      const requestBody = {
        UserName: data.userName || payload.userName,
        ProfilePhotoURL: data.profileImage ?? payload.profilePhotoURL ?? "",
        FirstName: data.firstName || payload.firstName,
        LastName: data.lastName || payload.lastName,
        Email: data.email ?? payload.email,
        Phone: payload.phone,

        Grade: data.grade ?? 0,
        Description: payload.description ?? "",

        // ⚠️ adjust to your backend enum
        Gender: data.gender === "male" ? 0 : 1,

        Availability: mapAvailabilityToApi(data.availability),

        Password: payload.password,
        ConfirmPassword: payload.confirmPassword,
      };

      await api.post("/account/register/student", requestBody);

      setIsSuccess(true);
      reset();
      navigate("/login");
    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      const resData = err?.response?.data;
      if (resData?.errors) {
        const messages = Object.values(resData.errors).flat().join("\\n");
        alert(messages);
      } else {
        alert(resData?.message || (typeof resData === 'string' ? resData : "Registration failed"));
      }
    }
  };

  // ✅ Only pass onComplete because StudentOnboarding expects only that
  return <StudentOnboarding onComplete={handleComplete} />;
}