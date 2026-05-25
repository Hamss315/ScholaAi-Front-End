import type { TeacherProfile } from "../types/schedule.types";

export function getCurrentUserProfile(): TeacherProfile | null {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function saveCurrentUserProfile(profile: TeacherProfile) {
  localStorage.setItem("user", JSON.stringify(profile));
}