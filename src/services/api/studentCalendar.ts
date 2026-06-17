import api from "../api";

export const getStudentCalendar = async () => {
  const response = await api.get("/studentSessions/GetMyRequests");
  return response.data;
};

// Map student requests to calendar sessions format
export const getStudentSessions = async () => {
    try {
        const data = await getStudentCalendar();
        // Map using the correct fields from studentSessionDto
        return data?.map((req: any) => ({
            id: req.sessionId,
            date: req.preferredDate ? req.preferredDate.split("T")[0] : null,
            teacher: req.teacherName || "Assigned Teacher",
            subject: req.subject || "Subject",
            time: req.preferredDate
                ? new Date(req.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "--:--",
            duration: "1 hour",
            status: req.status?.toLowerCase() === "accepted" ? "upcoming" : "pending",
        })).filter((s: any) => s.date !== null) || [];
    } catch(err) {
        console.error("Failed to fetch student calendar", err);
        return [];
    }
}
