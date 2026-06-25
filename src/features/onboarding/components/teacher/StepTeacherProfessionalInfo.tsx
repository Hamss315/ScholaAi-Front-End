import { Award } from "lucide-react";

import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import {
  TEACHER_EXPERIENCE_LEVELS,
} from "../../constants/onboarding.constants";
import type { TeacherOnboardingData } from "../../types/onboarding.types";

interface Props {
  formData: TeacherOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<TeacherOnboardingData>>;
  /** Subject names fetched from the API */
  subjects: string[];
}

export default function StepTeacherProfessionalInfo({
  formData,
  setFormData,
  subjects,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Award className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Professional Information</h3>
        <p className="text-sm text-gray-600">Share your expertise</p>
      </div>

      {/* ✅ SINGLE SUBJECT SELECTION */}
      <div>
        <Label className="mb-2 block">
          Subject You Teach * (Select one)
        </Label>

        {subjects.length === 0 ? (
          <p className="text-sm text-gray-400">Loading subjects...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={formData.subject === subject ? "default" : "outline"}
                className={`cursor-pointer text-center justify-center py-2 ${
                  formData.subject === subject
                    ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                    : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    subject,
                  }))
                }
              >
                {subject}
              </Badge>
            ))}
          </div>
        )}

        {formData.subject && (
          <p className="text-xs text-gray-500 mt-2">
            Selected: {formData.subject}
          </p>
        )}
      </div>

      {/* EXPERIENCE */}
      <div>
        <Label className="mb-1 block">
          Years of Teaching Experience *
        </Label>

        <Select
          value={formData.experience}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              experience: value as any,
            }))
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>

          <SelectContent>
            {TEACHER_EXPERIENCE_LEVELS.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}