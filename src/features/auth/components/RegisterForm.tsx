import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import RoleSelector from "./RoleSelector";

import { useRegister } from "../../../context/register-context";

type UserRole = "student" | "teacher";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setPayload } = useRegister();

  const [role, setRole] = useState<UserRole>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const canSubmit = useMemo(() => {
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    )
      return false;

    return password === confirmPassword;
  }, [firstName, lastName, userName, email, phone, password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // ✅ Save the common registration fields into context
    // Remaining fields will be completed in onboarding (grade, availability, gender, profilePhotoURL...)
    setPayload({
      role: role, // your context is for student/teacher; keep admin flow separate
      userName,
      profilePhotoURL: "",
      firstName,
      lastName,
      email,
      phone,
      description: "",
      gender: 0,
      availability: [],
      password,
      confirmPassword,
    } as any);

    if (role === "student") {
      navigate("/onboarding/student");
    } else if (role === "teacher") {
      navigate("/onboarding/teacher");
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

      {/* User Name */}
      <div>
        <Label htmlFor="user-name">User Name</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="user-name"
            type="text"
            placeholder="JDoe_2"
            className="pl-10"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="01012345678"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="reg-confirm-password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError("");
            }}
          />
        </div>

        {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}

        {!passwordError && password && confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
        )}
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

      <Button
        type="submit"
        className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
        disabled={!canSubmit}
      >
        Continue
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
