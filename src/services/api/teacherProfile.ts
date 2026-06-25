import api from "../api";

export interface StudentCardDto {
  studentId: string;
  studentName: string;
  profilePhotoURL?: string;
  subjectName: string;
  totalSessions: number;
  totalHours: number;
  averageFocusScore?: number;
  lastSessionDate?: string;
  lastSessionAgo: string;
  nextSessionDate?: string;
  nextSessionTime?: string;
  isActive: boolean;
}

export interface MyStudentsSummaryDto {
  totalStudents: number;
  activeStudents: number;
  previousStudents: number;
  totalSessions: number;
  totalHoursTaught: number;
  averageRating: number;
}

export interface MyStudentsListResponseDto {
  summary: MyStudentsSummaryDto;
  activeStudents: StudentCardDto[];
  previousStudents: StudentCardDto[];
}

export interface SessionFocusTrendDto {
  sessionNumber: number;
  date: string;
  focusScore: number;
}

export interface StudentSessionHistoryDto {
  sessionId: number;
  date: string;
  time: string;
  duration: string;
  focusScore?: number | null;
  status: string;
  summary?: string | null;
}

export interface StudentUpcomingSessionDto {
  sessionId: number;
  scheduledAt: string;
  time: string;
  duration: string;
}

export interface StudentProgressDto {
  studentId: string;
  studentName: string;
  profilePhotoURL?: string | null;
  subjectName: string;
  totalSessions: number;
  totalHours: number;
  averageFocusScore?: number | null;
  firstSessionDate?: string | null;
  lastSessionDate?: string | null;
  focusTrend: SessionFocusTrendDto[];
  sessionHistory: StudentSessionHistoryDto[];
  upcomingSessions: StudentUpcomingSessionDto[];
}

export const getMyStudents = async (
  search?: string
): Promise<{ success: boolean; data: MyStudentsListResponseDto }> => {
  const response = await api.get("/teacherProfile/myStudents", {
    params: { search: search?.trim() ? search.trim() : undefined },
  });
  return response.data;
};

// Returns data: null when the student has no sessions with this teacher (404)
export const getStudentProgress = async (
  studentId: string
): Promise<{ success: boolean; data: StudentProgressDto | null }> => {
  try {
    const response = await api.get(
      `/teacherProfile/myStudents/${studentId}/progress`
    );
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return { success: false, data: null };
    }
    throw err;
  }
};
