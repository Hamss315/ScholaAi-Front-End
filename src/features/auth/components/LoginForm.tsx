import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import { useAuth } from "../../../context/auth-context"; 
import { loginApi } from "../services/auth.service"
import { getRoleFromToken, getUserIdFromToken } from "../../../utils/jwt";

type UserRole = "student" | "teacher" | "admin";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

     try {
      const res = await loginApi({ email, password });

      // Adjust these based on your backend response fields:
      const token = res.token;
      const userId = res.userId || getUserIdFromToken(token);
      const role = ((res.role || getRoleFromToken(token) || "student") as string).toLowerCase() as UserRole;

      if (!token) throw new Error("No token returned from API");
      if (!userId) {
        // If backend doesn't return userId, we can decode from JWT — tell me and I’ll add it.
        throw new Error("No userId returned from API");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      login(token, {
        userId,
        role,
        email: res.email ?? email,
        userName: res.userName,
      });

    // Match your previous behavior (but with routes)
    if (role === "student") navigate("/student/dashboard", { replace: true });
    else if (role === "teacher") navigate("/teacher/dashboard", { replace: true });
    else navigate("/admin/panel", { replace: true });

    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      const data = err?.response?.data;
      setErrorMsg(data?.message || (typeof data === 'string' ? data : "Login failed"));
    } finally {
      setLoading(false);
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

    {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
