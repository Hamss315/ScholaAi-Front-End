import api from "../api";

export interface RatingDto {
  ratingId: number;
  sessionId: number;
  teacherId: string;
  studentId?: string;
  studentName?: string;
  ratingValue: number;
  comment?: string;
  createdAt: string;
}

export interface TeacherAverageRatingDto {
  teacherId: string;
  averageRating: number;
  totalRatings: number;
}

export const createRating = async (sessionId: number, ratingValue: number, comment: string = "") => {
    const response = await api.post(`/rating/${sessionId}`, {
        ratingValue,
        comment
    });
    return response.data;
};

export const updateRating = async (ratingId: number, ratingValue: number, comment: string = "") => {
    const response = await api.put(`/rating/${ratingId}`, {
        ratingValue,
        comment
    });
    return response.data;
};

export const deleteRating = async (ratingId: number) => {
    const response = await api.delete(`/rating/${ratingId}`);
    return response.data;
};

/** GET /api/rating/Teacher/{teacherId}/all */
export const getTeacherRatings = async (
  teacherId: string
): Promise<{ success: boolean; totalRatings: number; data: RatingDto[] }> => {
  const response = await api.get(`/rating/Teacher/${teacherId}/all`);
  return response.data;
};

/** GET /api/rating/Teacher/{teacherId}/average */
export const getTeacherAverageRating = async (
  teacherId: string
): Promise<{ success: boolean; data: TeacherAverageRatingDto }> => {
  const response = await api.get(`/rating/Teacher/${teacherId}/average`);
  return response.data;
};

