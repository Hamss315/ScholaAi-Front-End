import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import ResetPasswordLayout from "../components/ResetPasswordLayout";

export default function ResetPasswordEmailSentPage() {
  const navigate = useNavigate();

  return (
    <ResetPasswordLayout footerText="The reset link will expire in 1 hour">
      <Card className="p-8 shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <Mail className="w-10 h-10" style={{ color: "#22C55E" }} />
          </div>
        </div>

        <h2 className="text-2xl mb-3" style={{ color: "#1E3A8A" }}>
          Password Reset Link Sent
        </h2>

        <p className="text-gray-600 mb-6">
          We've sent a password reset link to your email address. Please check your inbox to continue.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Didn't receive the email?</strong>
            <br />
            Check your spam folder or wait a few minutes for it to arrive.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>For Testing:</strong> Click below to simulate clicking the reset link in your email
          </p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/reset-password/new")}>
            Simulate Email Link Click
          </Button>
        </div>

        <Button
          className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Card>
    </ResetPasswordLayout>
  );
}
