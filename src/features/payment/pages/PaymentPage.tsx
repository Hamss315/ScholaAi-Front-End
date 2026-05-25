import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Wallet, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

import WalletCard from "../components/WalletCard";
import RechargeForm from "../components/RechargeForm";
import TransactionList from "../components/TransactionList";
import UpcomingSessions from "../components/UpcomingSessions";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState(125.5);

  const recentTransactions = [
    { id: 1, type: "credit", amount: 100, description: "Wallet Recharge", date: "Feb 5, 2026", balance: 225.5 },
    { id: 2, type: "debit", amount: 45, description: "Session with Dr. Sarah Johnson - Mathematics", date: "Feb 4, 2026", balance: 125.5 },
    { id: 3, type: "debit", amount: 30, description: "Session with Prof. Michael Chen - Physics", date: "Feb 3, 2026", balance: 170.5 },
    { id: 4, type: "credit", amount: 50, description: "Wallet Recharge", date: "Feb 1, 2026", balance: 200.5 },
  ];

  const upcomingSessions = [
    { id: 1, teacher: "Dr. Sarah Johnson", subject: "Mathematics", date: "Feb 7, 2026", price: 45 },
    { id: 2, teacher: "Prof. Emily Carter", subject: "Chemistry", date: "Feb 9, 2026", price: 40 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <span className="text-2xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
          </div>

          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
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

          <WalletCard balance={walletBalance} />

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">
              <RechargeForm setWalletBalance={setWalletBalance} />
              <TransactionList transactions={recentTransactions} />
            </div>

            <UpcomingSessions sessions={upcomingSessions} />

          </div>
        </div>
      </div>
    </div>
  );
}