import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

type UserRole = "student" | "teacher" | "admin";

export default function LoginForm() {
  const navigate = useNavigate();
  const [role] = useState<UserRole>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Match your previous behavior (but with routes)
    if (role === "student") navigate("/student/profile");
    else if (role === "teacher") navigate("/teacher/dashboard");
    else navigate("/admin/panel");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
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

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/reset-password/request")}
                    className="text-sm hover:underline"
                    style={{ color: '#3B82F6' }}
                  >
                    Forgot Password?
                  </button>
                </div>

      <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90">
        Login
      </Button>
    </form>
  );
}
