import api from "../api";

export const getTeacherCalendar = async () => {
  const response = await api.get("/teacherSessions/GetMyRequests");
  return response.data;
};

// Map teacher requests to calendar sessions format
export const getTeacherSessions = async () => {
    try {
        const data = await getTeacherCalendar();
        // Map using the correct fields from teacherRequestDto
        return data?.map((req: any) => ({
            id: req.sessionId,
            date: req.preferredDate ? req.preferredDate.split("T")[0] : null,
            student: req.studentName || "Assigned Student",
            subject: req.subject || "Subject",
            time: req.preferredDate
                ? new Date(req.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "--:--",
            duration: "1 hour",
            status: req.isAccepted ? "upcoming" : "pending",
        })).filter((s: any) => s.date !== null) || [];
    } catch(err) {
        console.error("Failed to fetch teacher calendar", err);
        return [];
    }
}
