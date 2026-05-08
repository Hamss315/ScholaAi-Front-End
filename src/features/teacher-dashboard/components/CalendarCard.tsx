import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Calendar } from "../../../components/ui/calendar";
import { Button } from "../../../components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  availableDays?: number[];
}

export default function CalendarCard({ availableDays = [] }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="p-6">
      <h3 className="text-xl mb-4" style={{ color: '#1E3A8A' }}>Schedule Calendar</h3>
      <div className="flex justify-center">
        <Calendar 
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0 scale-110"
          modifiers={{
            available: (d) => availableDays.includes(d.getDay())
          }}
          modifiersStyles={{
            available: {
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              fontWeight: 'bold'
            }
          }}
        />
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-100"></div>
          <span>Available days based on your schedule</span>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-[#1E3A8A] text-[#1E3A8A]"
          asChild
        >
          <Link to="/teacher-calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            View Full Calendar
          </Link>
        </Button>
      </div>
    </Card>
  );
}
