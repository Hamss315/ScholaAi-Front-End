import { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import api from "../../../services/api";

export default function ResetPasswordNewForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !token) {
      setError("Invalid reset link. Missing email or token.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/account/reset-password", {
        email,
        token,
        newPassword,
        confirmNewPassword: confirmPassword
      });
      navigate("/reset-password/success");
    } catch (err: any) {
      setError(err?.response?.data || err?.message || "Failed to reset password.");
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
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-gray-700">Password must be at least 8 characters long</p>
        </div>

        <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Card>
  );
}
