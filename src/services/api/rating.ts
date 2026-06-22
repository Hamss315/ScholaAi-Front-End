import api from "../api";

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
