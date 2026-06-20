import { useNavigate } from "react-router-dom";
import { TrendingUp, FileText } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

export default function RecordCTA() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg mb-1">Done watching?</div>
          <div className="text-sm opacity-90">
            View the AI-powered session analysis — focus scores, emotional expressions, and a full summary.
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => navigate("/session-analysis")}
          >
            <TrendingUp className="w-4 h-4" />
            Session Analysis
          </Button>
          <Button
            className="bg-transparent border border-white text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
            onClick={() => navigate("/session/notes")}
          >
            <FileText className="w-4 h-4" />
            View Notes
          </Button>
        </div>
      </div>
    </Card>
  );
}
