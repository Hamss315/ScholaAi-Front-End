import { Users, Video, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface AdminStatsProps {
  totalUsersCount: number;
}

export default function AdminStats({ totalUsersCount }: AdminStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Total Users</span>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: '#1E3A8A' }}>{totalUsersCount}</div>
        <div className="text-sm text-gray-500">
          <span style={{ color: '#22C55E' }} className="font-semibold">↑ 12%</span> vs last month
        </div>
      </Card>

      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Active Sessions</span>
          <Video className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: '#3B82F6' }}>23</div>
        <span className="text-sm text-gray-500 font-medium">Currently live</span>
      </Card>

      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Revenue (Month)</span>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: '#22C55E' }}>$45,280</div>
        <div className="text-sm text-gray-500">
          <span style={{ color: '#22C55E' }} className="font-semibold">↑ 8%</span> vs last month
        </div>
      </Card>

      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Avg Rating</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color: '#FACC15' }}>4.8</div>
        <span className="text-sm text-gray-500 font-medium">Platform-wide</span>
      </Card>
    </div>
  );
}
