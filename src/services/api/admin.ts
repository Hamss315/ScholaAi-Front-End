import api from "../api";

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

export const getSubjects = async (): Promise<GetSubjectsResponse> => {
  const response = await api.get<GetSubjectsResponse>("/Admin/subjects");
  return response.data;
};
