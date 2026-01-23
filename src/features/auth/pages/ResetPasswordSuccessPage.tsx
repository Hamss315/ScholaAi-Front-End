import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import ResetPasswordLayout from "../components/ResetPasswordLayout";

export default function ResetPasswordSuccessPage() {
  const navigate = useNavigate();

  return (
    <ResetPasswordLayout footerText="Keep your password secure and don't share it with anyone">
      <Card className="p-8 shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10" style={{ color: "#22C55E" }} />
          </div>
        </div>

        <h2 className="text-2xl mb-3" style={{ color: "#1E3A8A" }}>
          Password Reset Successful!
        </h2>

        <p className="text-gray-600 mb-6">
          Your password has been reset successfully. You can now log in with your new password.
        </p>

        <Button
          className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Card>
    </ResetPasswordLayout>
  );
}
