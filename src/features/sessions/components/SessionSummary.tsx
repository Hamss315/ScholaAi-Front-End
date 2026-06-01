import { Brain } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface SessionSummaryProps {
  summary: string;
}

export default function SessionSummary({ summary }: SessionSummaryProps) {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "#1E3A8A" }}>
        <Brain className="w-5 h-5 text-purple-600" />
        AI-Generated Session Summary
      </h3>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-50/50">
        <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
      </div>
    </Card>
  );
}
