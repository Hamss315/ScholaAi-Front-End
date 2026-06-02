import { Calendar } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { sessionData } from "../../data/notesData";

export default function NotesCTA() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm opacity-90 mb-1">Next Session Scheduled</div>
          <div className="text-2xl flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {sessionData.nextSessionDate}
          </div>
        </div>
        <Button className="bg-white text-blue-600 hover:bg-gray-100 shrink-0" onClick={() => navigate("/student/calendar")}>
          View Calendar
        </Button>
      </div>
    </Card>
  );
}
