import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function TodayOverview() {
  return (
    <Card className="p-6">
      <h3 className="mb-4" style={{ color: '#1E3A8A' }}>Today's Overview</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Sessions Today</span>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">5</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Hours Taught</span>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">6.5</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Avg Focus</span>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">91%</Badge>
        </div>
      </div>
    </Card>
  );
}