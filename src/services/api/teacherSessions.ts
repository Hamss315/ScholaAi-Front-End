import api from "../api";

export const getTeacherRequests = async () => {
    const response = await api.get("/teacherSessions/GetMyRequests");
    return response.data;
};

export const acceptSessionRequest = async (sessionId: number) => {
    const response = await api.post(`/teacherSessions/${sessionId}/accept`);
    return response.data;
}

export const rejectSessionRequest = async (sessionId: number) => {
    const response = await api.post(`/teacherSessions/${sessionId}/reject`);
    return response.data;
}
