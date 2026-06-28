import api from "../../../services/api";

export interface TeacherProfileDto {
  userName: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  description?: string;
  profilePhotoURL?: string;
  college: string;
  certificate: string;
  teachingExperience: string;
  totalHoursTaught: number;
  averageRate: number;
  totalSessions: number;
  totalRatings?: number;
  subjects?: string | string[];
}

export interface UpdateTeacherProfileDto {
  userName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  description?: string;
  college?: string;
  certificate?: string;
  teachingExperience?: string;
}

export async function getTeacherProfile(userId: string) {
  const res = await api.get<TeacherProfileDto>(`/teacherProfile/${userId}`);
  return res.data;
}

export async function updateTeacherProfile(userId: string, data: UpdateTeacherProfileDto) {
  const res = await api.put(`/teacherProfile/${userId}`, data);
  return res.data;
}

export async function changeTeacherPassword(userId: string, data: any) {
  const res = await api.post(`/teacherProfile/${userId}/changePassword`, data);
  return res.data;
}

export async function uploadTeacherPhoto(userId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/teacherProfile/${userId}/uploadPhoto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
