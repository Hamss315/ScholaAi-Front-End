import { useNavigate } from "react-router-dom";
import { Brain, CreditCard, LogOut, MessageSquare, Send, LayoutDashboard, ChevronRight } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

export default function StudentProfileHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Logo — always navigates to dashboard */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/student/dashboard")}
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
              onClick={() => navigate("/student/dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/search-teachers")}>
              <Send className="w-4 h-4 mr-2" />
              Find Teachers
            </Button>

            <Button variant="ghost" onClick={() => navigate("/request-session")}>
              <Send className="w-4 h-4 mr-2" />
              Request Session
            </Button>

            <Button variant="ghost" onClick={() => navigate("/chats")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>

            <Button variant="ghost" onClick={() => navigate("/payment")}>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Hours
            </Button>

            <Avatar className="cursor-pointer" onClick={() => navigate("/student/profile")}>
              <AvatarFallback className="bg-[#8B5CF6] text-white">JS</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
