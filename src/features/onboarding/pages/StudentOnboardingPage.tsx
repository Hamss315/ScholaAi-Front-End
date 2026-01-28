import { useLocation, useNavigate } from "react-router-dom";
import StudentOnboarding from "../components/student/StudentOnboarding";

type LocationState = {
  fullName?: string;
  email?: string;
};

export default function StudentOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const fullName = state.fullName || "John Doe";
  const email = state.email;

  return (
    <StudentOnboarding
      fullName={fullName}
      email={email}
      onComplete={() => {
        // Change later to /student/dashboard
        navigate("/student/profile");
      }}
    />
  );
}
