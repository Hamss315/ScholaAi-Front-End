import { Card } from "../../../components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

export default function DashboardStats() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Today's Earnings</span>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#22C55E' }}>$175</div>
        <span className="text-sm text-gray-500">5 sessions completed</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">This Month</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#1E3A8A' }}>$2,850</div>
        <span className="text-sm text-gray-500">+12% vs last month</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Active Students</span>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#3B82F6' }}>18</div>
        <span className="text-sm text-gray-500">2 new this week</span>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Avg Rating</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl mb-1" style={{ color: '#FACC15' }}>4.9</div>
        <span className="text-sm text-gray-500">★★★★★</span>
      </Card>
    </div>
  );
}