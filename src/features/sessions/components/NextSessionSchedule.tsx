import { Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

interface NextSessionScheduleProps {
  nextSessionDate: string;
  onViewCalendar: () => void;
}

export default function NextSessionSchedule({
  nextSessionDate,
  onViewCalendar,
}: NextSessionScheduleProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs opacity-90 uppercase tracking-wider mb-1 font-semibold">
            Next Session Scheduled
          </div>
          <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 flex-shrink-0" />
            {nextSessionDate}
          </div>
        </div>
        <Button
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold self-stretch sm:self-auto"
          onClick={onViewCalendar}
        >
          View Calendar
        </Button>
      </div>
    </Card>
  );
}
