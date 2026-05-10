import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Clock } from "lucide-react";

export default function UpcomingClasses({ upcoming }: { upcoming: any[] }) {
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
            <div className="text-right">
              <div className="text-sm" style={{ color: '#3B82F6' }}>{session.time}</div>
              <div className="text-sm text-gray-500">{session.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}