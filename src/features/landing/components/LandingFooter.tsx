import { Brain } from "lucide-react";
import { Button } from "../../../components/ui/button";

type Props = {
  onTestResetPassword: () => void;
};

export default function LandingFooter({ onTestResetPassword }: Props) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8" style={{ color: "#8B5CF6" }} />
              <span className="text-2xl">ScholaAi</span>
            </div>
            <p className="text-gray-400">AI-powered learning made personal</p>
          </div>

          <div>
            <h4 className="mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Teachers</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ScholaAi. All rights reserved.</p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onTestResetPassword}
              className="text-gray-400 border-gray-700 hover:text-white hover:border-white"
            >
              Test Password Reset Flow
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
