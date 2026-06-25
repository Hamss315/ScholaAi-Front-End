import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

export default function RequestSessionHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = getInitials(user?.userName) || "ST";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
              </Button>
              <Brain className="w-8 h-8 text-purple-500" />
              <span className="text-2xl text-blue-900">ScholaAi</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-purple-500 text-white">{initials}</AvatarFallback>
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
