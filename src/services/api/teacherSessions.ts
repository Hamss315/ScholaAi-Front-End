import api from "../api";

export const getTeacherRequests = async () => {
    const response = await api.get("/teacherSessions/GetMyRequests");
    return response.data;
};

export const acceptSessionRequest = async (sessionId: number) => {
    const response = await api.post(`/teacherSessions/${sessionId}/accept`);
    return response.data;
};

export const rejectSessionRequest = async (sessionId: number) => {
    const response = await api.post(`/teacherSessions/${sessionId}/reject`);
    return response.data;
};

export const endSession = async (sessionId: number, focusScore = 0) => {
    const response = await api.post(`/teacherSessions/${sessionId}/end`, { focusScore });
    return response.data;
};

export const uploadRecording = async (sessionId: number, blob: Blob, durationSeconds: number) => {
    const formData = new FormData();
    formData.append('file', blob, `session-${sessionId}-${Date.now()}.webm`);
    formData.append('duration', String(durationSeconds));
    const response = await api.post(
        `/teacherSessions/${sessionId}/upload-recording`,
        formData
        //{ headers: { 'Content-Type': undefined } } // let axios set multipart/form-data + boundary automatically
    );
    return response.data;
};
