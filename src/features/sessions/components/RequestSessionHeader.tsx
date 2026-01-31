import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

export default function RequestSessionHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-500" />
              <span className="text-2xl text-blue-900">ScholaAi</span>
            </div>

            <Button variant="ghost" onClick={() => navigate("/student/profile")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-purple-500 text-white">ST</AvatarFallback>
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
