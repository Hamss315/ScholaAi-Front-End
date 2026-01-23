import { Brain, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import RegisterForm from "./RegisterForm";

export default function RegisterCard() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-10 h-10 text-violet-500" />
          <span className="text-3xl font-semibold text-blue-900">ScholaAi</span>
        </div>

        <p className="text-gray-600">Create your account to get started</p>
      </div>

      {/* Card */}
      <Card className="p-8 shadow-xl">
        <RegisterForm />
      </Card>

      <p className="text-center text-gray-600 mt-4 text-sm">
        Secure signup powered by industry-standard encryption
      </p>
    </div>
  );
}
