import { CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { PRICING_BULLETS } from "../constants/landing.constants";

type Props = {
  onGetStarted: () => void;
};

export default function PricingSection({ onGetStarted }: Props) {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4" style={{ color: "#1E3A8A" }}>
            Simple Wallet-Based System
          </h2>
          <p className="text-xl text-gray-600">Recharge your wallet and pay per session</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center border-2">
            <h3 className="text-3xl mb-2" style={{ color: "#1E3A8A" }}>
              Flexible Wallet System
            </h3>
            <p className="text-gray-600 mb-6">Add funds to your wallet and pay for individual sessions</p>

            <div className="text-5xl mb-6" style={{ color: "#8B5CF6" }}>
              $30-$50<span className="text-xl text-gray-600">/session</span>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {PRICING_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: "#22C55E" }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" onClick={onGetStarted}>
              Get Started
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
