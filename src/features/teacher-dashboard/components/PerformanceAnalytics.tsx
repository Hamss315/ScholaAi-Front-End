import { Card } from "../../../components/ui/card";

interface PerformanceAnalyticsProps {
  totalUpcoming: number;
  avgRating: number;
  avgFocus: number;
}

export default function PerformanceAnalytics({ totalUpcoming, avgRating, avgFocus }: PerformanceAnalyticsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-6" style={{ color: '#1E3A8A' }}>Performance Analytics</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Upcoming Sessions</div>
          <div className="text-2xl" style={{ color: '#3B82F6' }}>{totalUpcoming}</div>
          <div className="text-xs text-gray-500 mt-1">Scheduled in your queue</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Average Rating</div>
          <div className="text-2xl" style={{ color: '#8B5CF6' }}>{avgRating.toFixed(1)}</div>
          <div className="text-xs text-gray-500 mt-1">Based on dashboard metrics</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Avg Focus Score</div>
          <div className="text-2xl" style={{ color: '#22C55E' }}>{avgFocus.toFixed(0)}%</div>
          <div className="text-xs text-gray-500 mt-1">From recent sessions</div>
        </div>
      </div>
    </Card>
  );
}