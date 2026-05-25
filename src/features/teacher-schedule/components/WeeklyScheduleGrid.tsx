import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check } from "lucide-react";
import type { Availability } from "../types/schedule.types";

interface Props {
  availability: Availability;
  toggleTimeSlot: (day: string, slot: string) => void;
  isEditing: boolean;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const slots = [
  { value: "Morning (6-12)", label: "Morning", time: "6:00 AM - 12:00 PM" },
  { value: "Afternoon (12-17)", label: "Afternoon", time: "12:00 PM - 5:00 PM" },
  { value: "Evening (17-23)", label: "Evening", time: "5:00 PM - 11:00 PM" },
  { value: "Night (23-6)", label: "Night", time: "11:00 PM - 6:00 AM" },
];

export default function WeeklyScheduleGrid({
  availability,
  toggleTimeSlot,
  isEditing,
}: Props) {
  return (
    <Card className="p-6 rounded-xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl text-[#1E3A8A] mb-1">
          Weekly Availability
        </h2>
        <p className="text-sm text-gray-500">
          {isEditing
            ? "Click on time slots to mark your availability"
            : "Your current weekly schedule"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">

          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div></div>
            {days.map((d) => (
              <div key={d} className="text-center">
                <Badge className="bg-gray-100 text-gray-600 px-2 py-1">
                  {d}
                </Badge>
              </div>
            ))}
          </div>

          {/* Grid */}
          {slots.map((slot) => (
            <div key={slot.value} className="grid grid-cols-8 gap-2 mb-3">
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {slot.label}
                </span>
                <span className="text-xs text-gray-500">
                  {slot.time}
                </span>
              </div>

              {days.map((day) => {
                const active = (availability[day] || []).includes(slot.value);

                return (
                  <div
                    key={day}
                    onClick={() => toggleTimeSlot(day, slot.value)}
                    className={`
                      h-16 rounded-lg border flex items-center justify-center
                      transition-all duration-200
                      ${isEditing ? "cursor-pointer hover:scale-105" : ""}
                      ${
                        active
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                      }
                    `}
                  >
                    {active && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </Card>
  );
}