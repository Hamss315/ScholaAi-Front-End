import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function SearchHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between">

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <span className="text-2xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-[#3B82F6] text-white">S</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </header>
  );
}