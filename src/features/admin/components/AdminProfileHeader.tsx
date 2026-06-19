import { useNavigate } from "react-router-dom";
import { Brain, LogOut } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

type Props = {
  initials?: string;
};

export default function AdminProfileHeader({ initials = "AU" }: Props) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/admin/panel")}
          >
            <Brain className="w-8 h-8 shrink-0" style={{ color: "#8B5CF6" }} />
            <span className="text-2xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
            <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">Admin</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Avatar
              className="cursor-pointer"
              onClick={() => navigate("/admin/profile")}
            >
              <AvatarFallback className="bg-[#EF4444] text-white">{initials}</AvatarFallback>
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
