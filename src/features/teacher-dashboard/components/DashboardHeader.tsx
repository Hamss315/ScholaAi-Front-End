import { Brain, Users, Inbox, MessageSquare, Calendar, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

export default function DashboardHeader() {
  const { user } = useAuth();
  const initials = getInitials(user?.userName, user?.firstName, user?.lastName) || "DR";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <span className="text-2xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
            <Badge className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-100">Teacher</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/my-students" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                My Students
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/teacher/session-requests" className="flex items-center">
                <Inbox className="w-4 h-4 mr-2" />
                Requests
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/chats" className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/teacher/calendar" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                My Schedule
              </Link>
            </Button>
            <Link to="/teacher/profile">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-[#8B5CF6] text-white">{initials}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <LogOut className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}