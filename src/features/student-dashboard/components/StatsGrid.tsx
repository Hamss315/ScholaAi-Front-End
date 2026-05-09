import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Clock, TrendingUp, Video, FileText } from "lucide-react";

export default function StatsGrid() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Hours Left</span>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl text-[#1E3A8A]">12.5</div>
        <Badge className="bg-green-100 text-green-700">Active</Badge>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Avg Focus</span>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl text-green-600">91%</div>
        <span className="text-sm text-gray-500">+5% this week</span>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Sessions</span>
          <Video className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl text-[#1E3A8A]">24</div>
        <span className="text-sm text-gray-500">This month</span>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Notes</span>
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl text-purple-600">48</div>
        <span className="text-sm text-gray-500">AI generated</span>
      </Card>

    </div>
  );
}