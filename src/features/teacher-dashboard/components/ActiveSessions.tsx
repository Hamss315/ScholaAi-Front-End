import { Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

export default function ActiveSessions({ sessions }: { sessions: any[] }) {
  if (sessions.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-6" style={{ color: '#1E3A8A' }}>Active Sessions</h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Link to="/student-public-profile">
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-[#22C55E] text-white">
                      {session.student.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link 
                    to="/student-public-profile"
                    className="hover:underline" 
                    style={{ color: '#1E3A8A' }}
                  >
                    {session.student}
                  </Link>
                  <div className="text-sm text-gray-600">{session.subject} · Started {session.startTime}</div>
                </div>
              </div>
              {session.isCurrent && (
                <Badge className={session.status === "good" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  <Video className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">AI Focus Score</span>
                  <span style={{ color: session.focusScore >= 90 ? '#22C55E' : '#FACC15' }}>
                    {session.focusScore}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${session.focusScore}%`,
                      backgroundColor: session.focusScore >= 90 ? '#22C55E' : '#FACC15'
                    }}
                  />
                </div>
              </div>
              {session.isCurrent ? (
                <Button 
                  size="sm"
                  className="bg-[#22C55E] hover:bg-[#22C55E]/90"
                  asChild
                >
                  <Link to="/live-session">Join Now</Link>
                </Button>
              ) : (
                <Button 
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <Link to="/session-analysis">View Analysis</Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}