import api from "../../../services/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;

  // One of these (depends on your backend)
  userId?: string;

  role?: "student" | "teacher" | "admin";
  email?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
};

export async function loginApi(data: LoginRequest) {
  const res = await api.post<LoginResponse>("/account/login", data);
  return res.data;
}