import api from "../api";

export const getStudentRequests = async () => {
    const response = await api.get("/studentSessions/GetMyRequests");
    return response.data;
};

export const createSessionRequest = async (teacherId: string, subjectId: number, preferredTime: string, message: string) => {
    const response = await api.post("/studentSessions/CreateRequest", {
        teacherId,
        subjectId,
        preferredTime,
        message
    });
    return response.data;
}
