import { Card } from "../../../components/ui/card";

export default function PerformanceAnalytics() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-6" style={{ color: '#1E3A8A' }}>Performance Analytics</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Hours Taught</div>
          <div className="text-2xl" style={{ color: '#3B82F6' }}>142.5</div>
          <div className="text-xs text-gray-500 mt-1">This month: 38.5h</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Student Satisfaction</div>
          <div className="text-2xl" style={{ color: '#8B5CF6' }}>96%</div>
          <div className="text-xs text-gray-500 mt-1">Based on 45 reviews</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Avg Focus Score</div>
          <div className="text-2xl" style={{ color: '#22C55E' }}>89%</div>
          <div className="text-xs text-gray-500 mt-1">+3% this week</div>
        </div>
      </div>
    </Card>
  );
}