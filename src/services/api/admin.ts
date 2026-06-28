import axios from "axios";
import api from "../api";

// ─────────────────────────────────────────────────────────────────────────────
// Dedicated admin axios instance — reads adminToken (NOT the regular user token)
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_TOKEN_KEY = "adminToken";
const BASE_URL = `http://${window.location.hostname}:5254/api/Admin`;

const adminApi = axios.create({ baseURL: BASE_URL });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// ─────────────────────────────────────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────────────────────────────────────
export const saveAdminToken = (token: string) =>
  localStorage.setItem(ADMIN_TOKEN_KEY, token);

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem("adminProfile");
};

export interface SubjectDto {
  subjectId: number;
  name: string;
  description?: string;
  teacherCount?: number;
}

export interface GetSubjectsResponse {
  success: boolean;
  data: SubjectDto[];
}

export const getPublicSubjects = async (): Promise<GetSubjectsResponse> => {
  const response = await api.get<GetSubjectsResponse>("/Admin/subjects");
  return response.data;
};

export const isAdminAuthenticated = () => !!localStorage.getItem(ADMIN_TOKEN_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface AdminProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoURL: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  activeSessions: number;
  monthlyRevenue: number;
  averageRating: number;
  totalSessionsThisMonth: number;
}

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isSuspended: boolean;
  suspendedUntil: string | null;
}

export interface AdminUserDetail extends AdminUser {
  phoneNumber: string | null;
  description: string | null;
  profilePhotoURL: string | null;
  gender: string;
  grade: number | null;
  college: string | null;
  certificate: string | null;
  teachingExperience: string | null;
  subject: string | null;
  totalHoursTaught: number | null;
  averageRating: number | null;
}

export interface AdminSession {
  sessionId: number;
  teacherName: string;
  studentName: string;
  subjectName: string;
  scheduledAt: string | null;
  focusScore: number | null;
  isLive: boolean;
}

export interface AdminSessionDetail extends AdminSession {
  teacherId: string;
  studentId: string;
  summary: string;
  recordedSessionSeconds: number;
  transactionAmount: number | null;
}

export interface AdminPayment {
  transactionId: number;
  fromUserName: string;
  toUserName: string;
  amount: number;
  platformFee: number;
  createdAt: string;
  sessionId: number;
}

export interface AdminRating {
  ratingId: number;
  teacherName: string;
  studentName: string | null;
  ratingValue: number;
  comment: string | null;
  createdAt: string;
}

export interface AdminSubject {
  subjectId: number;
  name: string;
  description: string | null;
  teacherCount: number;
}

export interface AdminLog {
  logId: number;
  adminName: string;
  targetUserName: string | null;
  details: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  success: boolean;
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  data: T[];
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  const res = await adminApi.post("/login", { email, password });
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminProfile(): Promise<AdminProfile> {
  const res = await adminApi.get("/profile");
  return res.data.data;
}

export async function updateAdminProfile(dto: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}): Promise<void> {
  await adminApi.put("/profile", dto);
}

export async function changeAdminPassword(dto: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  await adminApi.post("/profile/change-password", dto);
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await adminApi.get("/dashboard");
  return res.data.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export async function getUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResponse<AdminUser>> {
  const res = await adminApi.get("/users", { params });
  return res.data;
}

export async function getUser(userId: string): Promise<AdminUserDetail> {
  const res = await adminApi.get(`/users/${userId}`);
  return res.data.data;
}

export async function createUser(dto: {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string | null;
  gender: string;
  grade?: number | null;
  college?: string | null;
  certificate?: string | null;
  teachingExperience?: string | null;
  subjectId?: number | null;
}): Promise<AdminUserDetail> {
  const res = await adminApi.post("/users", dto);
  return res.data.data;
}

export async function editUser(
  userId: string,
  dto: {
    userName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    description?: string | null;
    grade?: number | null;
    college?: string | null;
    certificate?: string | null;
    teachingExperience?: string | null;
  }
): Promise<void> {
  await adminApi.put(`/users/${userId}`, dto);
}

export async function deleteUser(userId: string): Promise<void> {
  await adminApi.delete(`/users/${userId}`);
}

export async function changeUserRole(userId: string, newRole: string): Promise<void> {
  await adminApi.put(`/users/${userId}/role`, { newRole });
}

export async function suspendUser(
  userId: string,
  durationInDays: number,
  reason?: string | null
): Promise<void> {
  await adminApi.post(`/users/${userId}/suspend`, { durationInDays, reason });
}

export async function unsuspendUser(userId: string): Promise<void> {
  await adminApi.post(`/users/${userId}/unsuspend`);
}

export async function verifyTeacher(teacherId: string, notes?: string | null): Promise<void> {
  await adminApi.post(`/users/${teacherId}/verify`, { notes });
}

export async function unverifyTeacher(teacherId: string): Promise<void> {
  await adminApi.post(`/users/${teacherId}/unverify`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────────────────────────────────────
export async function getSessions(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResponse<AdminSession>> {
  const res = await adminApi.get("/sessions", { params });
  return res.data;
}

export async function getLiveSessions(): Promise<{
  success: boolean;
  totalCount: number;
  data: AdminSession[];
}> {
  const res = await adminApi.get("/sessions/live");
  return res.data;
}

export async function getSession(sessionId: number): Promise<AdminSessionDetail> {
  const res = await adminApi.get(`/sessions/${sessionId}`);
  return res.data.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────
export async function getPayments(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResponse<AdminPayment>> {
  const res = await adminApi.get("/payments", { params });
  return res.data;
}

export async function getPayment(transactionId: number): Promise<AdminPayment> {
  const res = await adminApi.get(`/payments/${transactionId}`);
  return res.data.data;
}

export async function exportPayments(): Promise<Blob> {
  const res = await adminApi.get("/payments/export", { responseType: "blob" });
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// RATINGS
// ─────────────────────────────────────────────────────────────────────────────
export async function getRatings(): Promise<{
  success: boolean;
  totalCount: number;
  data: AdminRating[];
}> {
  const res = await adminApi.get("/ratings");
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS
// ─────────────────────────────────────────────────────────────────────────────
export async function getSubjects(): Promise<AdminSubject[]> {
  const res = await adminApi.get("/subjects");
  return res.data.data;
}

export async function createSubject(dto: {
  name: string;
  description?: string | null;
}): Promise<AdminSubject> {
  const res = await adminApi.post("/subjects", dto);
  return res.data.data;
}

export async function updateSubject(
  subjectId: number,
  dto: { name?: string | null; description?: string | null }
): Promise<void> {
  await adminApi.put(`/subjects/${subjectId}`, dto);
}

export async function deleteSubject(subjectId: number): Promise<void> {
  await adminApi.delete(`/subjects/${subjectId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminLogs(): Promise<{
  success: boolean;
  totalCount: number;
  data: AdminLog[];
}> {
  const res = await adminApi.get("/logs");
  return res.data;
}
