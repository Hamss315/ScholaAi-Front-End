import { useNavigate } from "react-router-dom";
import { Brain, CreditCard, LogOut, MessageSquare, Send } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

export default function StudentProfileHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/student/dashboard")}
          >
            <Brain className="w-8 h-8" style={{ color: "#8B5CF6" }} />
            <span className="text-2xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/student/find-teachers")}>
              <Send className="w-4 h-4 mr-2" />
              Find Teachers
            </Button>

            <Button variant="ghost" onClick={() => navigate("/student/request-session")}>
              <Send className="w-4 h-4 mr-2" />
              Request Session
            </Button>

            <Button variant="ghost" onClick={() => navigate("/student/messages")}>
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
