import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpcomingClasses({ upcoming }: { upcoming: any[] }) {
  const navigate = useNavigate();

  const isStartable = (scheduledAt: string) => {
    try {
      const now = new Date();
      const sessionDate = new Date(scheduledAt); // ISO string parses directly
      const diffMinutes = (sessionDate.getTime() - now.getTime()) / (1000 * 60);
      return diffMinutes <= 15; // allow starting 15 min before
    } catch (e) {
      return false;
    }
  };

  const handleStart = (session: any) => {
    const teacherId = localStorage.getItem("userId"); 
    const token = localStorage.getItem("token") ?? "test";
    navigate(`/session/${session.id}/stream?role=host&peerId=${teacherId}&token=${token}`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>Upcoming Classes</h2>
        <Button variant="outline" asChild>
          <Link to="/teacher/calendar">
            <Clock className="w-4 h-4 mr-2" />
            Set Availability
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {upcoming.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-[#3B82F6] text-white">
                  {session.student.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div style={{ color: '#1E3A8A' }}>{session.student}</div>
                <div className="text-sm text-gray-600">{session.subject}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-[#22C55E] hover:bg-[#22C55E]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isStartable(session.time)}
                onClick={() => handleStart(session)}
              >
                {isStartable(session.scheduledAt) ? (
                  <Link to={`/live-session/${session.id}`}>Start</Link>
                ) : (
                  <span>Start</span>
                )}
              </Button>
              <div className="text-sm" style={{ color: '#3B82F6' }}>
                {new Date(session.scheduledAt).toLocaleString('en-US', {
                  month: 'short', day: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}