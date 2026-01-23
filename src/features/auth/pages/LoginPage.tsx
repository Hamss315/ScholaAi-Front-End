import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <LoginCard />
    </div>
  );
}

export default LoginPage;
