import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function EarningsCard() {
  return (
    <Card className="p-6">
      <h3 className="mb-4" style={{ color: '#1E3A8A' }}>Earnings Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Pending Payout</span>
          <span className="text-xl" style={{ color: '#22C55E' }}>$450</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">This Week</span>
          <span>$625</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Month</span>
          <span>$2,540</span>
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Lifetime</span>
            <span style={{ color: '#1E3A8A' }}>$18,750</span>
          </div>
        </div>
        <Button className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" asChild>
          <Link to="/teacher/payout">
            <DollarSign className="w-4 h-4 mr-2" />
            Request Payout
          </Link>
        </Button>
      </div>
    </Card>
  );
}