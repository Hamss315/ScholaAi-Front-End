import { Brain, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

export default function AdminHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <span className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>ScholaAi</span>
            <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer" onClick={() => navigate("/admin/users/admin@scholaai.com")}>
              <AvatarFallback className="bg-[#EF4444] text-white">AD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
