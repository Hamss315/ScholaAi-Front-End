import { Users, Video, DollarSign, TrendingUp, GraduationCap, BookOpen } from "lucide-react";
import { Card } from "../../../components/ui/card";
import type { DashboardStats } from "../../../services/api/admin";

interface AdminStatsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-sm text-gray-500">{sub}</div>}
    </Card>
  );
}

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6 bg-white border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <StatCard
        label="Total Users"
        value={stats?.totalUsers ?? 0}
        sub={`${stats?.totalStudents ?? 0} students · ${stats?.totalTeachers ?? 0} teachers`}
        icon={Users}
        color="#1E3A8A"
      />
      <StatCard
        label="Students"
        value={stats?.totalStudents ?? 0}
        icon={GraduationCap}
        color="#3B82F6"
      />
      <StatCard
        label="Teachers"
        value={stats?.totalTeachers ?? 0}
        icon={BookOpen}
        color="#8B5CF6"
      />
      <StatCard
        label="Active Sessions"
        value={stats?.activeSessions ?? 0}
        sub="Currently live"
        icon={Video}
        color="#3B82F6"
      />
      <StatCard
        label="Revenue (Month)"
        value={`${(stats?.monthlyRevenue ?? 0).toLocaleString()} EGP`}
        sub={`${stats?.totalSessionsThisMonth ?? 0} sessions`}
        icon={DollarSign}
        color="#22C55E"
      />
      <StatCard
        label="Avg Rating"
        value={(stats?.averageRating ?? 0).toFixed(1)}
        sub="Platform-wide"
        icon={TrendingUp}
        color="#FACC15"
      />
    </div>
  );
}
