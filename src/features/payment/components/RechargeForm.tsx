import { useState } from "react";
import { Plus, CreditCard, Lock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function RechargeForm({ setWalletBalance }: any) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");

  const quickAmounts = [
    { value: 25, label: "$25" },
    { value: 50, label: "$50" },
    { value: 100, label: "$100" },
    { value: 200, label: "$200" },
  ];

  const amount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && amount > 0) {
      setWalletBalance((prev: number) => prev + amount);
    }
  };

  return (
    <Card className="p-6">

      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-6 h-6" style={{ color: '#22C55E' }} />
        <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>Recharge Wallet</h2>
      </div>

      <form onSubmit={handleRecharge} className="space-y-6">

        {/* Quick */}
        <div>
          <Label className="mb-3 block">Quick Select Amount</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAmounts.map((a) => (
              <div
                key={a.value}
                onClick={() => {
                  setSelectedAmount(a.value);
                  setCustomAmount("");
                }}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                  selectedAmount === a.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1" style={{ color: '#1E3A8A' }}>{a.label}</div>
                <div className="text-xs text-gray-500">Quick recharge</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or enter custom amount</span>
          </div>
        </div>

        {/* Custom */}
        <div>
          <Label>Custom Amount (USD)</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input
              type="number"
              className="pl-7"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              min="5"
            />
          </div>
        </div>

        {/* Payment */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-green-500" />
            <h3 className="text-lg" style={{ color: '#1E3A8A' }}>Payment Method</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <div className="relative mt-1">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="1234 5678 9012 3456" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="MM/YY" />
              <Input placeholder="CVV" />
            </div>

            <Input placeholder="Cardholder Name" />
          </div>
        </div>

        <Button className="w-full bg-[#22C55E] h-12">
          Recharge ${amount.toFixed(2)}
        </Button>

      </form>
    </Card>
  );
}