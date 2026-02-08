import { Brain } from "lucide-react";
import { Button } from "../../../components/ui/button";

type Props = {
  onLoginClick: () => void;
};

export default function LandingHeader({ onLoginClick }: Props) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8" style={{ color: "#8B5CF6" }} />
          <span className="text-2xl" style={{ color: "#1E3A8A" }}>
            ScholaAi
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <Button variant="outline" onClick={onLoginClick}>
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
}
