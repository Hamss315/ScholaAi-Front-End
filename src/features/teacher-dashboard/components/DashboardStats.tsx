import { Card } from "../../../components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface DashboardStatsProps {
  todayEarnings: number;
  thisMonthEarnings: number;
  activeStudents: number;
  avgRating: number;
}

export default function DashboardStats({
  todayEarnings,
  thisMonthEarnings,
  activeStudents,
  avgRating,
}: DashboardStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Today's Earnings</span>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#22C55E' }}>${todayEarnings.toFixed(2)}</div>
        <span className="text-sm text-gray-500">From today's sessions</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">This Month</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#1E3A8A' }}>${thisMonthEarnings.toFixed(2)}</div>
        <span className="text-sm text-gray-500">Current month earnings</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Active Students</span>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#3B82F6' }}>{activeStudents}</div>
        <span className="text-sm text-gray-500">From your upcoming sessions</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Avg Rating</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#FACC15' }}>{avgRating.toFixed(1)}</div>
        <span className="text-sm text-gray-500">★★★★★</span>
      </Card>
    </div>
  );
}