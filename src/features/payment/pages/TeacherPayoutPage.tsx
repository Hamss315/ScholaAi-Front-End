import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Banknote, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";

import PayoutBalanceCard from "../components/PayoutBalanceCard";
import PayoutForm from "../components/PayoutForm";
import EarningsSummary from "../components/EarningsSummary";
import PayoutInfo from "../components/PayoutInfo";
import PayoutHistory from "../components/PayoutHistory";

import { paymentService } from "../../payment/services/payment.service";
import { getTeacherSummary } from "../../../services/api/teacherDashboard";

export default function TeacherPayoutPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [earnings, setEarnings] = useState({
    week: 0,
    month: 0,
    lastMonth: 0,
    lifetime: 0,
  });
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const minimumPayout = 50.0;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const wallet = await paymentService.getWalletBalance();
        setAvailableBalance(wallet.balance);

        const summary = await getTeacherSummary();
        const txs = await paymentService.getTransactions();

        const lifetime = txs
          .filter((t) => t.type === "credit")
          .reduce((sum, t) => sum + t.amount, 0);

        setEarnings({
          week: summary.thisWeekEarnings,
          month: summary.thisMonthEarnings,
          lastMonth: summary.lastMonthEarnings,
          lifetime,
        });

        const debits = txs
          .filter((t) => t.type === "debit")
          .map((t) => ({
            id: t.id,
            amount: t.amount,
            method: "Bank Transfer",
            status: "Completed",
            date: new Date(t.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            transactionId: `TXN-${new Date(t.date).getFullYear()}-${String(t.id).padStart(3, "0")}`,
          }));

        setPayoutHistory(debits);
      } catch (err) {
        console.error("Failed to load payout data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRequestSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      navigate("/teacher/dashboard");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8" style={{ color: "#8B5CF6" }} />
              <span className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
                ScholaAi
              </span>
              <Badge className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">
                Teacher
              </Badge>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <Banknote className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#1E3A8A" }}>
              Request Payout
            </h1>
            <p className="text-xl text-gray-600">
              Withdraw your earnings to your preferred account
            </p>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" style={{ color: "#22C55E" }} />
              <AlertDescription>
                <span className="font-semibold" style={{ color: "#1E3A8A" }}>
                  Payout request submitted successfully!
                </span>{" "}
                You'll receive the funds within 3-5 business days.
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading payout details...
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Payout Form */}
              <div className="lg:col-span-2 space-y-6">
                <PayoutBalanceCard balance={availableBalance} />
                <PayoutForm
                  availableBalance={availableBalance}
                  minimumPayout={minimumPayout}
                  onSubmitSuccess={handleRequestSuccess}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <EarningsSummary
                  week={earnings.week}
                  month={earnings.month}
                  lastMonth={earnings.lastMonth}
                  lifetime={earnings.lifetime}
                />
                <PayoutInfo />
                <PayoutHistory history={payoutHistory} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
