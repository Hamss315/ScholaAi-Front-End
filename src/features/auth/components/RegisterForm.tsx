import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import RoleSelector from "./RoleSelector";

type UserRole = "student" | "teacher" | "admin";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "student") {
      navigate("/onboarding/student", { state: { firstName, lastName, email } });
    } else if (role === "teacher") {
      navigate("/onboarding/teacher", { state: { firstName, lastName, email } });
    } else {
      navigate("/admin/panel");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <Label htmlFor="first-name">First Name</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="first-name"
            type="text"
            placeholder="John"
            className="pl-10"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="last-name">Last Name</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="last-name"
            type="text"
            placeholder="Doe"
            className="pl-10"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="reg-email">Email</Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="reg-email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Role Selector */}
      <RoleSelector
        role={role}
        setRole={setRole}
        label="Register as"
        allowedRoles={["student", "teacher"]}
      />

      {/* Terms */}
      <div className="text-sm text-gray-600">
        By registering, you agree to our{" "}
        <a href="#" className="hover:underline" style={{ color: "#3B82F6" }}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:underline" style={{ color: "#3B82F6" }}>
          Privacy Policy
        </a>
        .
      </div>

      <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90">
        Create Account
      </Button>

      {/* Login */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          className="hover:underline"
          style={{ color: "#3B82F6" }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </form>
  );
}
