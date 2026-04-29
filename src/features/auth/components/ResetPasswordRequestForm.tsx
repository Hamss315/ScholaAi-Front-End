import { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import api from "../../../services/api";

export default function ResetPasswordRequestForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/account/forgot-password", { email });
      navigate("/reset-password/email-sent");
    } catch (err: any) {
      setError(err?.response?.data || err?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{typeof error === 'string' ? error : "An error occurred"}</p>
          </div>
        )}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm hover:underline"
            style={{ color: "#3B82F6" }}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </div>
      </form>
    </Card>
  );
}
