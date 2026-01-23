import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import ResetPasswordLayout from "../components/ResetPasswordLayout";
import ResetPasswordRequestForm from "../components/ResetPasswordRequestForm";

export default function ResetPasswordRequestPage() {
  const navigate = useNavigate();

  return (
    <ResetPasswordLayout
      title="Reset Your Password"
      subtitle="Enter your email to receive a password reset link"
      topAction={
        <Button variant="ghost" onClick={() => navigate("/login")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      }
      footerText="We'll send you instructions to reset your password"
    >
      <ResetPasswordRequestForm />
    </ResetPasswordLayout>
  );
}
