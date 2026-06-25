import { useState } from "react";
import { Plus, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentService } from "../services/payment.service";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  "pk_test_51TUOLdL6Oj7PgzciRUbgw89ktrHJHQV6NAx7LlrXA19Mf09h9R8ms2y0d13pJA60Ic80349uXFLXPuq45Pkr5OtL00THh6vv69"
);

function RechargeFormInner({ onRechargeSuccess }: { onRechargeSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const quickAmounts = [
    { value: 25, label: "$25" },
    { value: 50, label: "$50" },
    { value: 100, label: "$100" },
    { value: 200, label: "$200" },
  ];

  const amount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMsg("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (amount <= 0) {
      setErrorMsg("Please select or enter a valid recharge amount.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Create payment intent in the backend
      const intentRes = await paymentService.createPaymentIntent(amount);

      // 2. Confirm card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setErrorMsg("Card inputs are missing.");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(intentRes.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Payment confirmation failed.");
        setLoading(false);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // 3. Inform backend to credit wallet directly for local testing
        await paymentService.confirmAndCreditTest(amount);
        setSuccessMsg(`Successfully recharged $${amount.toFixed(2)}!`);
        onRechargeSuccess();
        setCustomAmount("");
        setSelectedAmount(50);
        cardElement.clear();
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || err.message || "An error occurred during recharge."
      );
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
          <Plus className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
          Recharge Wallet
        </h2>
      </div>

      <form onSubmit={handleRecharge} className="space-y-6">
        {/* Quick Amount Select */}
        <div>
          <Label className="mb-3 block text-gray-700 font-medium">
            Quick Select Amount
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAmounts.map((a) => (
              <div
                key={a.value}
                onClick={() => {
                  setSelectedAmount(a.value);
                  setCustomAmount("");
                  setErrorMsg("");
                }}
                className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  selectedAmount === a.value
                    ? "border-purple-600 bg-purple-50/50 shadow-sm"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50/30"
                }`}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: selectedAmount === a.value ? "#7C3AED" : "#1E3A8A" }}
                >
                  {a.label}
                </div>
                <div className="text-xs text-gray-500">Quick recharge</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400">
              or enter custom amount
            </span>
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <Label className="text-gray-700 font-medium">Custom Amount (USD)</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              $
            </span>
            <Input
              type="number"
              className="pl-8 h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-xl"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
                setErrorMsg("");
              }}
              min="5"
            />
          </div>
        </div>

        {/* Stripe CardElement input */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold" style={{ color: "#1E3A8A" }}>
              Secure Payment Method
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-600 mb-2 block">Card Information</Label>
              <div className="border border-gray-200 rounded-xl px-4 py-4 bg-gray-50/10 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all shadow-inner">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#1E3A8A",
                        fontFamily: "Outfit, Inter, sans-serif",
                        "::placeholder": {
                          color: "#9CA3AF",
                        },
                      },
                      invalid: {
                        color: "#EF4444",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || amount <= 0}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold h-13 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing Recharge...
            </div>
          ) : (
            `Recharge $${amount.toFixed(2)}`
          )}
        </Button>
      </form>
    </Card>
  );
}

export default function RechargeForm({ onRechargeSuccess }: { onRechargeSuccess: () => void }) {
  return (
    <Elements stripe={stripePromise}>
      <RechargeFormInner onRechargeSuccess={onRechargeSuccess} />
    </Elements>
  );
}