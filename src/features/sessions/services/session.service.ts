import api from "../../../services/api";

export interface CreateSessionRequestDto {
  subjectId: number;
  preferredDate: string;
  description?: string;
}

export interface TeacherRequestDto {
  sessionId: number;
  studentId?: string;
  studentName: string;
  subject: string;
  preferredDate: string;
  description?: string;
  isAccepted: boolean;
}

export interface StudentSessionDto {
  sessionId: number;
  subject: string;
  preferredDate: string;
  status: string;
  teacherName?: string;
}

export async function createSessionRequest(data: CreateSessionRequestDto) {
  const res = await api.post("/studentSessions/CreateRequest", data);
  return res.data;
}

export async function getStudentRequests() {
  const res = await api.get<StudentSessionDto[]>("/studentSessions/GetMyRequests");
  return res.data;
}

export async function getTeacherRequests() {
  const res = await api.get<TeacherRequestDto[]>("/teacherSessions/GetMyRequests");
  return res.data;
}

export async function acceptSessionRequest(sessionId: number) {
  const res = await api.post(`/teacherSessions/${sessionId}/accept`);
  return res.data;
}

export async function rejectSessionRequest(sessionId: number) {
  const res = await api.post(`/teacherSessions/${sessionId}/reject`);
  return res.data;
}
