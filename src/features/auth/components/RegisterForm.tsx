import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import RoleSelector from "./RoleSelector";

import { useRegister } from "../../../context/register-context";
import api from "../../../services/api";

type UserRole = "student" | "teacher";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { payload, setPayload } = useRegister();

  const [role, setRole] = useState<UserRole>(payload?.role ?? "student");
  const [firstName, setFirstName] = useState(payload?.firstName ?? "");
  const [lastName, setLastName] = useState(payload?.lastName ?? "");
  const [userName, setUserName] = useState(payload?.userName ?? "");
  const [email, setEmail] = useState(payload?.email ?? "");

  const [phone, setPhone] = useState(payload?.phone ?? "");

  const [password, setPassword] = useState(payload?.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState(payload?.confirmPassword ?? "");
  const [passwordError, setPasswordError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[@_]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasCapital || !hasSpecial || !hasNumber) {
      const errorMsg = "Password must contain at least one capital letter, one number, and one special character (such as @ or _).";
      setPasswordError(errorMsg);
      alert(errorMsg);
      return;
    }

    setIsChecking(true);

    try {
      if (role === "student") {
        await api.post("/account/register/Student", {
          UserName: userName,
          Email: email,
          Password: "invalidpassword",
          ConfirmPassword: "invalidpassword",
          FirstName: firstName,
          LastName: lastName,
          Phone: phone,
          Gender: 0,
          Grade: 1,
          Availability: [{ Day: 1, TimeSlot: 1 }],
        });
      } else {
        await api.post("/account/register/Teacher", {
          UserName: userName,
          Email: email,
          Password: "invalidpassword",
          ConfirmPassword: "invalidpassword",
          FirstName: firstName,
          LastName: lastName,
          Phone: phone,
          Gender: 0,
          College: "N/A",
          Certificate: "N/A",
          IdNumber: "000000000",
          SubjectId: 1,
          TeachingExperience: "0-2",
          Availability: [{ Day: 1, TimeSlot: 1 }],
          OpenForImmediate: false,
        });
      }

      console.warn("Dry-run registration succeeded unexpectedly.");
    } catch (err: any) {
      const resData = err?.response?.data;
      let errorText = "";
      if (resData?.errors) {
        errorText = Object.values(resData.errors).flat().join(" ");
      } else if (resData?.message) {
        errorText = resData.message;
      } else if (typeof resData === "string") {
        errorText = resData;
      } else {
        errorText = err.message || "";
      }

      const lowerError = errorText.toLowerCase();

      if (lowerError.includes("email is already registered") || (lowerError.includes("email") && lowerError.includes("in use"))) {
        alert("Email is already registered.");
        setIsChecking(false);
        return;
      }
      if (lowerError.includes("username") && (lowerError.includes("taken") || lowerError.includes("already"))) {
        alert("Username is already taken.");
        setIsChecking(false);
        return;
      }

      const isPasswordPolicyError = 
        lowerError.includes("password") || 
        lowerError.includes("digit") || 
        lowerError.includes("uppercase") || 
        lowerError.includes("lowercase") || 
        lowerError.includes("alphanumeric") ||
        lowerError.includes("non-alphanumeric");

      if (!isPasswordPolicyError) {
        alert(errorText || "Registration check failed.");
        setIsChecking(false);
        return;
      }
    }

    setIsChecking(false);

    // Save the common registration fields into context
    setPayload({
      role: role,
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
        <p className="text-xs text-gray-500 mt-1">
          Must contain at least one capital letter, one number, and one special character (such as @ or _).
        </p>
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
        disabled={!canSubmit || isChecking}
      >
        {isChecking ? "Checking availability..." : "Continue"}
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
