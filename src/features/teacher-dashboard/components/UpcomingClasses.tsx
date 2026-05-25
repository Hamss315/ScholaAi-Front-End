import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Clock } from "lucide-react";

export default function UpcomingClasses({ upcoming }: { upcoming: any[] }) {
  const isStartable = (timeStr: string) => {
    if (timeStr.includes("Tomorrow")) return false;
    
    try {
      const now = new Date();
      const [time, modifier] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let sessionHours = hours;
      if (modifier === 'PM' && hours < 12) sessionHours += 12;
      if (modifier === 'AM' && hours === 12) sessionHours = 0;
      
      const sessionDate = new Date(now);
      sessionDate.setHours(sessionHours, minutes || 0, 0, 0);
      
      return now >= sessionDate;
    } catch (e) {
      return false;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>Upcoming Classes</h2>
        <Button variant="outline" asChild>
          <Link to="/teacher-schedule">
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
                asChild={isStartable(session.time)}
                disabled={!isStartable(session.time)}
              >
                {isStartable(session.time) ? (
                  <Link to="/live-session">Start</Link>
                ) : (
                  <span>Start</span>
                )}
              </Button>
              <div className="text-right min-w-[100px]">
                <div className="text-sm" style={{ color: '#3B82F6' }}>{session.time}</div>
                <div className="text-sm text-gray-500">{session.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}