import React, { createContext, useContext, useMemo, useState } from "react";

/** Your roles */
export type UserRole = "student" | "teacher";

/** Backend expects: availability: [{ day: number, timeSlot: number }] */
export type AvailabilityItem = { day: number; timeSlot: number };

/** Data common to both student and teacher register endpoints */
export interface BaseRegisterData {
  role: UserRole;
  userName: string;
  profilePhotoURL?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  gender: number; // 0/1 based on your backend enum
  availability: AvailabilityItem[];
  password: string;
  confirmPassword: string;
}

/** Student-specific fields */
export interface StudentRegisterExtra {
  grade: number;
}

/** Teacher-specific fields (you'll use later) */
export interface TeacherRegisterExtra {
  college: string;
  certificate: string;
  subjectId: number;
  teachingExperience: string;
}

/** Full register payload in context */
export type RegisterPayload =
  | (BaseRegisterData & { role: "student" } & Partial<StudentRegisterExtra>)
  | (BaseRegisterData & { role: "teacher" } & Partial<TeacherRegisterExtra>);

interface RegisterContextValue {
  payload: RegisterPayload | null;
  setPayload: React.Dispatch<React.SetStateAction<RegisterPayload | null>>;
  updatePayload: (patch: Partial<RegisterPayload>) => void;
  reset: () => void;
}

const RegisterContext = createContext<RegisterContextValue | undefined>(undefined);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<RegisterPayload | null>(null);

  const updatePayload = (patch: Partial<RegisterPayload>) => {
    setPayload((prev) => (prev ? { ...prev, ...patch } : (patch as RegisterPayload)));
  };

  const reset = () => setPayload(null);

  const value = useMemo(
    () => ({ payload, setPayload, updatePayload, reset }),
    [payload]
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}

export function useRegister() {
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error("useRegister must be used inside RegisterProvider");
  return ctx;
}
