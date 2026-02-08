import { useNavigate } from "react-router-dom";

import LandingHeader from "../components/LandingHeader";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import PricingSection from "../components/PricingSection";
import LandingFooter from "../components/LandingFooter";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <LandingHeader onLoginClick={() => navigate("/login")} />
      <HeroSection onJoinClick={() => navigate("/login")} />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection onGetStarted={() => navigate("/login")} />
      <LandingFooter onTestResetPassword={() => navigate("/reset-password/new")} />
    </div>
  );
}
