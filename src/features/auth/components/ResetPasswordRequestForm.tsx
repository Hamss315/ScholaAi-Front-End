import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function ResetPasswordRequestForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/reset-password/email-sent");
  };

  return (
    <Card className="p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
        >
          Send Reset Link
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm hover:underline"
            style={{ color: "#3B82F6" }}
          >
            Back to Login
          </button>
        </div>
      </form>
    </Card>
  );
}
