import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

interface Props {
  fullName?: string;
}

export default function ScheduleHeader({ fullName }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = getInitials(fullName || user?.userName) || "T";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Brain className="w-7 h-7 text-[#8B5CF6]" />
              <span className="text-2xl font-semibold text-[#1E3A8A]">
                ScholaAi
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#8B5CF6] text-white">
                {initials}
              </AvatarFallback>
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