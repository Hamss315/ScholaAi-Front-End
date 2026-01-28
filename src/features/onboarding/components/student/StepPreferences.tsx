import { Clock, Sparkles } from "lucide-react";

import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import type { StudentOnboardingData } from "../../types/onboarding.types";
import {
  STUDENT_SESSION_DURATIONS,
  STUDENT_TIME_SLOTS,
  STUDENT_WEEK_DAYS,
} from "../../constants/onboarding.constants";

interface Props {
  formData: StudentOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<StudentOnboardingData>>;
}

export default function StepPreferences({ formData, setFormData }: Props) {
  const toggleAvailability = (day: string, slot: string) => {
    setFormData((prev) => {
      const daySlots = prev.availability[day] || [];
      const nextSlots = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];

      return {
        ...prev,
        availability: { ...prev.availability, [day]: nextSlots },
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Learning Preferences</h3>
        <p className="text-sm text-gray-600">Help us personalize your experience</p>
      </div>

      <div>
        <Label htmlFor="duration" className="mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Preferred Session Duration *
        </Label>

        <Select
          value={formData.sessionDuration}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, sessionDuration: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {STUDENT_SESSION_DURATIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-3 block">Weekly Availability (Optional)</Label>
        <div className="border rounded-lg p-4">
          <div className="space-y-3">
            {STUDENT_WEEK_DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-12 text-sm">{day}</span>
                <div className="flex gap-2 flex-1">
                  {STUDENT_TIME_SLOTS.map((slot) => (
                    <Badge
                      key={slot}
                      variant={(formData.availability[day] || []).includes(slot) ? "default" : "outline"}
                      className={`cursor-pointer flex-1 justify-center ${
                        (formData.availability[day] || []).includes(slot)
                          ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                          : ""
                      }`}
                      onClick={() => toggleAvailability(day, slot)}
                    >
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This helps teachers know when you're available for sessions
        </p>
      </div>
    </div>
  );
}
