import { useLocation, useNavigate } from "react-router-dom";
import TeacherOnboarding from "../components/teacher/TeacherOnboarding";

type LocationState = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function TeacherOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const firstName = state.firstName || "Dr. Jane";
  const lastName = state.lastName || "Smith";
  const email = state.email;

  return (
    <TeacherOnboarding
      firstName={firstName}
      lastName={lastName}
      email={email}
      onComplete={() => {
        // Change later to /teacher/dashboard
        navigate("/login");
      }}
    />
  );
}
