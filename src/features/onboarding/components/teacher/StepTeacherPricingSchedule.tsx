import { CalendarCheck } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";

import { WEEK_DAYS, TEACHER_TIME_SLOTS } from "../../constants/onboarding.constants";
import type { TeacherOnboardingData, WeekDay } from "../../types/onboarding.types";

interface Props {
  formData: TeacherOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<TeacherOnboardingData>>;
}

export default function StepTeacherPricingSchedule({ formData, setFormData }: Props) {
  const toggleAvailability = (day: WeekDay, slot: string) => {
    setFormData((prev) => {
      const daySlots = prev.availability[day] || [];
      const updated = daySlots.includes(slot) ? daySlots.filter((s) => s !== slot) : [...daySlots, slot];
      return { ...prev, availability: { ...prev.availability, [day]: updated } };
    });
  };

  const selectedSlotsCount = Object.values(formData.availability).flat().length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CalendarCheck className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Schedule</h3>
        <p className="text-sm text-gray-600">Set your availability</p>
      </div>

      <div>
        <Label className="mb-2 block">Weekly Availability * (Select at least 3 time slots)</Label>
        <div className="border rounded-lg p-4 space-y-3">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-12 text-sm">{day}</span>
              <div className="flex gap-2 flex-1 flex-wrap">
                {TEACHER_TIME_SLOTS.map((slot) => {
                  const isSelected = (formData.availability[day as WeekDay] || []).includes(slot);
                  return (
                    <Badge
                      key={slot}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer text-xs ${isSelected ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90" : ""}`}
                      onClick={() => toggleAvailability(day as WeekDay, slot)}
                    >
                      {slot}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-2">Selected: {selectedSlotsCount} time slots</p>
      </div>

      <div className="flex items-start gap-3 p-4 border rounded-lg">
        <Checkbox
          id="immediate-lessons"
          checked={formData.openForImmediate}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, openForImmediate: checked === true }))}
        />
        <div className="flex-1">
          <Label htmlFor="immediate-lessons" className="cursor-pointer">
            Open for immediate lesson requests
          </Label>
          <p className="text-xs text-gray-500 mt-1">Allow students to request lessons with short notice.</p>
        </div>
      </div>
    </div>
  );
}
