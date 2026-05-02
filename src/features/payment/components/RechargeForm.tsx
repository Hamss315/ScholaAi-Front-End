import { useState } from "react";
import { Plus, CreditCard, Lock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function RechargeForm({
  setBalance,
  balance,
}: {
  setBalance: (v: number) => void;
  balance: number;
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");

  const quickAmounts = [25, 50, 100, 200];

  const amount =
    selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount < 5) return;

    // mock update (replace later with API)
    setBalance(balance + amount);

    alert(`Recharged $${amount}`);
  };

  return (
    <Card className="p-6">

      <h2 className="text-2xl mb-6">Recharge Wallet</h2>

      <form onSubmit={handleRecharge} className="space-y-6">

        {/* Quick amounts */}
        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((a) => (
            <div
              key={a}
              onClick={() => {
                setSelectedAmount(a);
                setCustomAmount("");
              }}
              className={`p-4 border rounded-lg cursor-pointer text-center ${
                selectedAmount === a ? "border-blue-600 bg-blue-50" : ""
              }`}
            >
              ${a}
            </div>
          ))}
        </div>

        {/* Custom */}
        <div>
          <Label>Custom Amount</Label>
          <Input
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            type="number"
            min="5"
          />
        </div>

        {/* Payment method UI (UNCHANGED VISUAL) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            Payment Method
          </div>

          <Input placeholder="Card Number" className="mb-2" />
          <Input placeholder="MM/YY" className="mb-2" />
          <Input placeholder="CVV" className="mb-2" />
          <Input placeholder="Cardholder Name" />
        </div>

        <Button className="w-full bg-green-500">
          <Plus className="w-4 h-4 mr-2" />
          Recharge ${amount.toFixed(2)}
        </Button>

      </form>
    </Card>
  );
}