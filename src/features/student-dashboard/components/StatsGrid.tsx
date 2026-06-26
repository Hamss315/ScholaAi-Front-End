import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Clock, TrendingUp, Video, FileText } from "lucide-react";

interface StatsGridProps {
  walletBalance: number;
  avgFocusScore: number;
  sessionsThisMonth: number;
  notesCount: number;
}

export default function StatsGrid({
  walletBalance,
  avgFocusScore,
  sessionsThisMonth,
  notesCount,
}: StatsGridProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Wallet Balance</span>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-semibold text-[#1E3A8A]">{walletBalance.toFixed(2)} EGP</div>
        <Badge className="bg-green-100 text-green-700 mt-2 hover:bg-green-100">Active</Badge>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Avg Focus</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-semibold text-green-600">{Math.round(avgFocusScore)}%</div>
        <span className="text-sm text-gray-500 block mt-2">Overall focus score</span>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Sessions</span>
          <Video className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-semibold text-[#1E3A8A]">{sessionsThisMonth}</div>
        <span className="text-sm text-gray-500 block mt-2">This month</span>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Notes</span>
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-semibold text-purple-600">{notesCount}</div>
        <span className="text-sm text-gray-500 block mt-2">AI generated</span>
      </Card>

    </div>
  );
}