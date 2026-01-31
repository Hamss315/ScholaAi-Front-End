import { Brain, LogOut, MessageSquare, CalendarIcon, Inbox, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function TeacherProfileHeader() {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Brain className="w-8 h-8 shrink-0" style={{ color: "#8B5CF6" }} />
            <span className="text-2xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
            <Badge className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-100">Teacher</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <Users className="w-4 h-4 mr-2" />
                My Students
            </Button>
            <Button variant="ghost" onClick={() => navigate("/teacher/session-requests")}>
              <Inbox className="w-4 h-4 mr-2 shrink-0"/>
              Requests
              <Badge className="ml-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">2</Badge>
            </Button>

            <Button variant="ghost" onClick={() => navigate("/teacher/messages")}>
              <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
              Messages
            </Button>

            <Button variant="ghost">
              <CalendarIcon className="w-4 h-4 mr-2 shrink-0" />
              My Schedule
            </Button>

            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-[#8B5CF6] text-white">SR</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <LogOut className="w-5 h-5 shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
