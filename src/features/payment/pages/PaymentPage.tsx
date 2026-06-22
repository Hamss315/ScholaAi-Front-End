import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Wallet, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

import WalletCard from "../components/WalletCard";
import RechargeForm from "../components/RechargeForm";
import TransactionList from "../components/TransactionList";
import UpcomingSessions from "../components/UpcomingSessions";
import { paymentService, type TransactionInfo } from "../services/payment.service";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<{ id: number; teacher: string; subject: string; date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWalletData = async (showSpinner: boolean) => {
    try {
      if (showSpinner) setLoading(true);
      setError("");
      
      const [walletRes, transactionsRes, upcomingRes] = await Promise.all([
        paymentService.getWalletBalance(),
        paymentService.getTransactions(),
        paymentService.getUpcomingSessions(),
      ]);
      
      setWalletBalance(walletRes.balance);
      setTransactions(transactionsRes);
      setUpcomingSessions(upcomingRes);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load wallet data. Please check your connection.");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          <p className="text-gray-500 font-medium">Loading Wallet details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/student/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <span className="text-2xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
          </div>
        </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-12">
            <Wallet className="w-10 h-10 mx-auto mb-4" style={{ color: '#8B5CF6' }} />
            <h1 className="text-4xl mb-4" style={{ color: '#1E3A8A' }}>My Wallet</h1>
            <p className="text-xl text-gray-600">Manage your balance and view transaction history</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-shake">
              {error}
            </div>
          )}

          <WalletCard balance={walletBalance} />

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">
              <RechargeForm onRechargeSuccess={() => loadWalletData(false)} />
              <TransactionList transactions={transactions} />
            </div>

            <UpcomingSessions sessions={upcomingSessions} />

          </div>
        </div>
      </div>
    </div>
  );
}