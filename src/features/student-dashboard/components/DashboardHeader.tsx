import {
  Brain,
  Search,
  Send,
  MessageSquare,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-[#8B5CF6]" />
          <span className="text-2xl text-[#1E3A8A]">ScholaAi</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Button variant="ghost" onClick={() => navigate("/search-teachers")}>
            <Search className="w-4 h-4 mr-2" />
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
            Wallet
          </Button>

          <Avatar
            className="cursor-pointer"
            onClick={() => navigate("/student/profile")}
          >
            <AvatarFallback className="bg-[#8B5CF6] text-white">
              JS
            </AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="w-5 h-5" />
          </Button>

        </div>
      </div>
    </header>
  );
}