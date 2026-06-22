import api from "../api";

export const searchTeachers = async (name?: string, subject?: string, keyword?: string) => {
    let queryParams = new URLSearchParams();
    if(name) queryParams.append("name", name);
    if(subject && subject !== "all") queryParams.append("subject", subject);
    if(keyword) queryParams.append("keyword", keyword);

    try {
        const response = await api.get(`/teacherProfile/search?${queryParams.toString()}`);
        // Backend returns array directly
        return Array.isArray(response.data) ? response.data : [];
    } catch (err: any) {
        // 404 means no teachers found — return empty array instead of throwing
        if (err?.response?.status === 404) return [];
        console.error("Failed to search teachers", err);
        return [];
    }
};
