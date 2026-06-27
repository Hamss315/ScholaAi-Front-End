import api from "../../../services/api";

export type PaymentHistoryItem = {
  id?: number;
  date?: string;
  amount?: number;
  status?: string;
};

export type StudentProfileDto = {
  userName: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  description?: string;
  profilePhotoURL?: string; 
  grade?: number;
  totalSessions: number;
  totalHours: number;
  averageFocusScore: number;
  sessionsThisMonth: number;
  walletBalance: number | null;
  lastTopUp: string | null;
  paymentHistory: PaymentHistoryItem[];
};

export type UpdateStudentProfileDto = {
  userName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  grade?: number;
  description?: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function getStudentProfile(userId: string | number) {
  const res = await api.get<StudentProfileDto>(`/studentProfile/${userId}`);
  return res.data;
}

export async function updateStudentProfile(userId: string | number, body: Partial<UpdateStudentProfileDto>) {
  const res = await api.put(`/studentProfile/${userId}`, body);
  return res.data;
}

export async function changeStudentPassword(userId: string | number, body: ChangePasswordDto) {
  const res = await api.post(`/studentProfile/${userId}/changePassword`, body);
  return res.data;
}