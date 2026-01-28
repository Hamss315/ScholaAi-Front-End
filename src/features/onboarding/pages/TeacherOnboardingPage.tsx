import { useLocation, useNavigate } from "react-router-dom";
import TeacherOnboarding from "../components/teacher/TeacherOnboarding";

type LocationState = {
  fullName?: string;
  email?: string;
};

export default function TeacherOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const fullName = state.fullName || "Dr. Jane Smith";
  const email = state.email;

  return (
    <TeacherOnboarding
      fullName={fullName}
      email={email}
      onComplete={() => {
        // Change later to /teacher/dashboard
        navigate("/login");
      }}
    />
  );
}
