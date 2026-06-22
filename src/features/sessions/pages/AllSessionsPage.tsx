import { Video } from "lucide-react";
import AllSessionsHeader from "../components/all-sessions/AllSessionsHeader";
import AllSessionsStats from "../components/all-sessions/AllSessionsStats";
import AllSessionsContent from "../components/all-sessions/AllSessionsContent";

export default function AllSessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AllSessionsHeader />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-8 h-8" style={{ color: '#3B82F6' }} />
            <h1 className="text-4xl" style={{ color: '#1E3A8A' }}>All Sessions</h1>
          </div>
          <p className="text-gray-600">Browse your complete session history, view recordings, and access AI-generated notes.</p>
        </div>

        <AllSessionsStats />
        <AllSessionsContent />
      </div>
    </div>
  );
}
