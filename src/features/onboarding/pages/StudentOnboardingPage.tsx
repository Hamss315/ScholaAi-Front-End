import { useLocation, useNavigate } from "react-router-dom";
import StudentOnboarding from "../components/student/StudentOnboarding";

type LocationState = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function StudentOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const firstName = state.firstName || "John";
  const lastName = state.lastName || "Doe";
  const email = state.email;

  return (
    <StudentOnboarding
      firstName={firstName}
      lastName={lastName}
      email={email}
      onComplete={() => {
        // Change later to /student/dashboard
        navigate("/student/profile");
      }}
    />
  );
}
