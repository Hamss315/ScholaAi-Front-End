import { Brain, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import LoginTabs from "./LoginTabs";

export default function LoginCard() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-10 h-10" style={{ color: '#8B5CF6' }} />
            <span className="text-3xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
          </div>
          <p className="text-gray-600">Welcome back! Please login to continue</p>
        </div>

      {/* Card */}
      <Card className="p-8 shadow-xl">
        <LoginTabs />
      </Card>

      <p className="text-center text-gray-600 mt-4 text-sm">
        Secure login powered by industry-standard encryption
      </p>
    </div>
  );
}
