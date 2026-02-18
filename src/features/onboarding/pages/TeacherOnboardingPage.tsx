import { useLocation, useNavigate } from "react-router-dom";
import TeacherOnboarding from "../components/teacher/TeacherOnboarding";

type LocationState = {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
};

export default function TeacherOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const firstName = state.firstName || "Dr. Jane";
  const lastName = state.lastName || "Smith";
  const userName = state.userName || "DrSmith_123";
  const email = state.email;

  return (
    <TeacherOnboarding
      firstName={firstName}
      lastName={lastName}
      userName={userName}
      email={email}
      onComplete={() => {
        // Change later to /teacher/dashboard
        navigate("/login");
      }}
    />
  );
}
