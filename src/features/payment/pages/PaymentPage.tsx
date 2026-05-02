import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import WalletCard from "../components/WalletCard";
import RechargeForm from "../components/RechargeForm";
import TransactionList from "../components/TransactionList";
import UpcomingSessions from "../components/UpcomingSessions";
import { paymentService } from "../services/payment.service";

interface PaymentPageProps {
  onNavigate: (page: string) => void;
}

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const [walletBalance, setWalletBalance] = useState(125.5);

  const recentTransactions = paymentService.getMockTransactions();
  const upcomingSessions = paymentService.getMockUpcomingSessions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Header (UNCHANGED) */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl">ScholaAi</div>

          <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Wallet Card (same UI) */}
          <WalletCard balance={walletBalance} />

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">

              <RechargeForm
                balance={walletBalance}
                setBalance={setWalletBalance}
              />

              <TransactionList transactions={recentTransactions} />

            </div>

            {/* Right */}
            <UpcomingSessions sessions={upcomingSessions} />

          </div>
        </div>
      </div>
    </div>
  );
}