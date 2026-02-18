import { useNavigate } from "react-router-dom";
import StudentOnboarding from "../components/student/StudentOnboarding";

import api from "../../../services/api";
import { useRegister } from "../../../context/register-context";
import type { StudentOnboardingData } from "../types/onboarding.types";

/**
 * Convert your UI availability:
 *   { Monday: ["Morning", "Evening"], Tuesday: ["Afternoon"] }
 * into backend format:
 *   [{ day: 0, timeSlot: 0 }, ...]
 *
 * ✅ IMPORTANT: Update dayMap/slotMap to match your backend enums.
 */
function mapAvailabilityToApi(av: Record<string, string[]>) {
  const dayMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
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

  // ✅ If user refreshes or comes directly without register step
  if (!payload || payload.role !== "student") {
    navigate("/register");
    return null;
  }

  const handleComplete = async (data: StudentOnboardingData) => {
    try {
      // ✅ Build backend DTO
      const requestBody = {
        userName: data.userName || payload.userName,
        profilePhotoURL: data.profileImage ?? payload.profilePhotoURL ?? "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? payload.email,
        phone: payload.phone, // from RegisterForm
        grade: data.grade ?? 0,
        description: payload.description ?? "",
        gender: data.gender === "male" ? 0 : 1, // ✅ update if backend enum differs
        availability: mapAvailabilityToApi(data.availability),
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      };

      await api.post("/account/register/student", requestBody);

      // ✅ clear context to remove password from memory
      reset();

      navigate("/student/profile");
    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <StudentOnboarding
      firstName={payload.firstName}
      lastName={payload.lastName}
      userName={payload.userName}
      email={payload.email}
      onComplete={handleComplete}
    />
  );
}
