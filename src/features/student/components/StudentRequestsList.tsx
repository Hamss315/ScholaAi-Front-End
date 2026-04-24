import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { getStudentRequests } from "../../sessions/services/session.service";
import type { StudentSessionDto } from "../../sessions/services/session.service";

export default function StudentRequestsList() {
  const [requests, setRequests] = useState<StudentSessionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return <p className="text-gray-600 mt-6">Loading requests...</p>;
  }

  if (error) {
    return <p className="text-red-600 mt-6">{error}</p>;
  }

  if (requests.length === 0) {
    return <p className="text-gray-600 mt-6">You have no session requests.</p>;
  }

  return (
    <div className="mt-8">
      <h4 className="text-xl mb-4 font-semibold" style={{ color: "#1E3A8A" }}>
        My Session Requests
      </h4>
      <div className="space-y-4">
        {requests.map((req) => {
          const dDate = new Date(req.preferredDate);
          
          let StatusIcon = Clock;
          let statusColor = "text-yellow-600";
          let bgStatusColor = "bg-yellow-50";

          if (req.status.toLowerCase() === "accepted") {
            StatusIcon = CheckCircle;
            statusColor = "text-green-600";
            bgStatusColor = "bg-green-50";
          } else if (req.status.toLowerCase() === "rejected") {
            StatusIcon = XCircle;
            statusColor = "text-red-600";
            bgStatusColor = "bg-red-50";
          }

          return (
            <div key={req.sessionId} className="p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg" style={{ color: "#1E3A8A" }}>
                  {req.subject || `Subject`}
                </p>
                <p className="text-sm text-gray-600">
                  {dDate.toLocaleDateString()} at {dDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {req.teacherName && (
                  <p className="text-sm text-gray-500 mt-1">Teacher: {req.teacherName}</p>
                )}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${bgStatusColor} ${statusColor}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">{req.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
