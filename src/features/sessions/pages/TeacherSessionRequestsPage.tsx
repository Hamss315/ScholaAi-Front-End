import { useState } from "react";

import { Card } from "../../../components/ui/card";
import TeacherRequestsHeader from "../components/TeacherRequestsHeader";
import TeacherRequestsTabs from "../components/TeacherRequestsTabs";

import type { SessionRequest } from "../types/session.types";
import { TEACHER_DEMO_REQUESTS } from "../constants/teacherRequests.constants";

export default function TeacherSessionRequestsPage() {
  const [requests, setRequests] = useState<SessionRequest[]>(TEACHER_DEMO_REQUESTS);

  const handleAccept = (id: number) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
    alert("Session request accepted! The student will be notified and the session will be added to your calendar.");
  };

  const handleDecline = (id: number) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r)));
    alert("Session request declined. The student will be notified.");
  };

  const handleMessageStudent = (id: number) => {
    // Prototype navigation placeholder
    alert(`Open chat for request #${id} (prototype)`);
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

        <Card className="p-0 border-0 bg-transparent shadow-none">
          <TeacherRequestsTabs
            requests={requests}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onMessageStudent={handleMessageStudent}
          />
        </Card>
      </div>
    </div>
  );
}
