import { Brain, LogOut, MessageSquare, CalendarIcon, Inbox, Users, LayoutDashboard, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

export default function TeacherProfileHeader({ profileData }: { profileData?: { firstName?: string; lastName?: string } }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = getInitials(user?.userName, profileData?.firstName, profileData?.lastName) || "SR";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo — always navigates to dashboard */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/teacher/dashboard")}
              title="Go to Dashboard"
            >
              <Brain
                className="w-8 h-8 transition-transform group-hover:scale-110"
                style={{ color: "#8B5CF6" }}
              />
              <span className="text-2xl font-semibold hidden sm:block" style={{ color: "#1E3A8A" }}>
                ScholaAi
              </span>
            </div>

            {/* Breadcrumb separator */}
            <ChevronRight className="w-4 h-4 text-gray-300" />

            {/* Back to Dashboard button — explicit, visible affordance */}
            <Button
              size="sm"
              onClick={() => navigate("/teacher/dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/my-students")}>
              <Users className="w-4 h-4 mr-2" />
                My Students
            </Button>
            <Button variant="ghost" onClick={() => navigate("/teacher/session-requests")}>
              <Inbox className="w-4 h-4 mr-2 shrink-0"/>
              Requests
            </Button>

            <Button variant="ghost" onClick={() => navigate("/chats")}>
              <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
              Messages
            </Button>

            <Button variant="ghost" onClick={() => navigate("/teacher/calendar")}>
              <CalendarIcon className="w-4 h-4 mr-2 shrink-0" />
              My Schedule
            </Button>

            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-[#8B5CF6] text-white">{initials}</AvatarFallback>
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
