import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/ui/card";
import TeacherRequestsHeader from "../components/TeacherRequestsHeader";
import TeacherRequestsTabs from "../components/TeacherRequestsTabs";

import type { SessionRequest } from "../types/session.types";
import { getTeacherRequests, acceptSessionRequest, rejectSessionRequest } from "../services/session.service";

export default function TeacherSessionRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getTeacherRequests();
      
      const mapped: SessionRequest[] = data.map((d) => {
        const dDate = new Date(d.preferredDate);
        return {
          id: d.sessionId,
          studentId: d.studentId,
          studentName: d.studentName || `Student`,
          studentInitials: (d.studentName || "ST").substring(0, 2).toUpperCase(),
          subject: d.subject || `Subject`,
          preferredDate: dDate.toLocaleDateString(),
          preferredTime: dDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: "1 hour",
          notes: d.description,
          requestedDate: "Recently",
          status: d.isAccepted ? "accepted" : "pending",
        };
      });
      setRequests(mapped);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      await acceptSessionRequest(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
      alert("Session request accepted!");
    } catch (err: any) {
      alert("Failed to accept request: " + (err?.response?.data?.message || err?.message));
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await rejectSessionRequest(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r)));
      alert("Session request declined.");
    } catch (err: any) {
      alert("Failed to decline request: " + (err?.response?.data?.message || err?.message));
    }
  };

  const handleMessageStudent = (id: number) => {
    const request = requests.find((r) => r.id === id);
    if (request && request.studentId) {
      navigate(`/chat/${request.studentId}`, {
        state: {
          chat: {
            id: request.studentId,
            otherUserId: request.studentId,
            otherUserName: request.studentName,
            otherUserRole: "student",
            unreadCount: 0,
            online: false,
          },
        },
      });
    } else {
      alert("Student ID not found for this request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherRequestsHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: "#1E3A8A" }}>
            Session Requests
          </h1>
          <p className="text-gray-600">Review and manage session requests from students</p>
        </div>

        {isLoading ? (
          <p>Loading requests...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <Card className="p-0 border-0 bg-transparent shadow-none">
            <TeacherRequestsTabs
              requests={requests}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onMessageStudent={handleMessageStudent}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
