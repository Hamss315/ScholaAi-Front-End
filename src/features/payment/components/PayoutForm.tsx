import React, { useState } from "react";
import { DollarSign, Building2, CreditCard } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { paymentService } from "../services/payment.service";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface PayoutFormProps {
  availableBalance: number;
  minimumPayout: number;
  onSubmitSuccess: () => void;
}

export default function PayoutForm({
  availableBalance,
  minimumPayout,
  onSubmitSuccess,
}: PayoutFormProps) {
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [amount, setAmount] = useState<string>(availableBalance.toString());
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    setAmount(availableBalance.toString());
  }, [availableBalance]);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await paymentService.requestPayout(parsedAmount);
      onSubmitSuccess();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to request payout.");
    } finally {
      setSubmitting(false);
    }
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-6" style={{ color: "#1E3A8A" }}>
        Payout Details
      </h2>

      <form onSubmit={handleRequestPayout} className="space-y-6">
        {/* Payout Amount */}
        <div>
          <Label htmlFor="amount">Payout Amount (USD)</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={availableBalance}
              min={minimumPayout}
              step="0.01"
              className="pl-7"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum payout: ${minimumPayout.toFixed(2)} | Maximum: $
            {availableBalance.toFixed(2)}
          </p>
        </div>

        {/* Payout Method Select */}
        <div>
          <Label htmlFor="payoutMethod">Payout Method</Label>
          <Select value={payoutMethod} onValueChange={setPayoutMethod}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select payout method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Transfer (ACH)</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="wire">Wire Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bank Transfer ACH Details */}
        {payoutMethod === "bank" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5" style={{ color: "#3B82F6" }} />
              <h3 className="text-lg" style={{ color: "#1E3A8A" }}>
                Bank Account Details
              </h3>
            </div>

            <div>
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                type="text"
                placeholder="Dr. Sarah Roberts"
                className="mt-1"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  type="text"
                  placeholder="123456789"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="1234567890"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="Bank of America"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select defaultValue="checking">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* PayPal Details */}
        {payoutMethod === "paypal" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" style={{ color: "#3B82F6" }} />
              <h3 className="text-lg" style={{ color: "#1E3A8A" }}>
                PayPal Account
              </h3>
            </div>

            <div>
              <Label htmlFor="paypalEmail">PayPal Email Address</Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your.email@example.com"
                className="mt-1"
                required
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-sm text-blue-800">
                PayPal charges a 2% processing fee. You'll receive $
                {(parsedAmount * 0.98).toFixed(2)} after fees.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Wire Transfer Details */}
        {payoutMethod === "wire" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5" style={{ color: "#3B82F6" }} />
              <h3 className="text-lg" style={{ color: "#1E3A8A" }}>
                Wire Transfer Details
              </h3>
            </div>

            <div>
              <Label htmlFor="wireAccountName">Account Holder Name</Label>
              <Input
                id="wireAccountName"
                type="text"
                placeholder="Dr. Sarah Roberts"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
              <Input
                id="swiftCode"
                type="text"
                placeholder="BOFAUS3N"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="iban">IBAN or Account Number</Label>
              <Input
                id="iban"
                type="text"
                placeholder="US12 3456 7890 1234 5678 90"
                className="mt-1"
                required
              />
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-sm text-yellow-800">
                Wire transfers incur a $25 fee and take 5-7 business days. Only
                recommended for amounts over $1,000.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={submitting || parsedAmount < minimumPayout || parsedAmount > availableBalance}
            className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 h-12 text-lg text-white font-medium"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                Request Payout of ${parsedAmount.toFixed(2)}
              </>
            )}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-3">
            Processing time: 3-5 business days for bank transfers
          </p>
        </div>
      </form>
    </Card>
  );
}
