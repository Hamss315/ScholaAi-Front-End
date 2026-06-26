import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Banknote } from "lucide-react";
import { Link } from "react-router-dom";

interface EarningsCardProps {
  thisWeek: number;
  lastMonth: number;
  thisMonth: number;
  walletBalance: number;
}

export default function EarningsCard({ thisWeek, lastMonth, thisMonth, walletBalance }: EarningsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4" style={{ color: '#1E3A8A' }}>Earnings Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Balance</span>
          <span className="text-xl font-bold" style={{ color: '#22C55E' }}>{walletBalance.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">This Week</span>
          <span>{thisWeek.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Month</span>
          <span>{lastMonth.toFixed(2)} EGP</span>
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">This Month</span>
            <span style={{ color: '#1E3A8A' }}>{thisMonth.toFixed(2)} EGP</span>
          </div>
        </div>
        <Button className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" asChild>
          <Link to="/teacher/payout">
            <Banknote className="w-4 h-4 mr-2" />
            Request Payout
          </Link>
        </Button>
      </div>
    </Card>
  );
}