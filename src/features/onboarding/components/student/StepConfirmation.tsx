import { CheckCircle2, User } from "lucide-react";

import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";

import type { StudentOnboardingData } from "../../types/onboarding.types";

interface Props {
  formData: StudentOnboardingData;
}

export default function StepConfirmation({ formData }: Props) {
  const gradeLabel = formData.grade ? `Grade ${formData.grade}` : "Not selected";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-green-600" />
        <h3 className="text-gray-900 mb-1">Profile Summary</h3>
        <p className="text-sm text-gray-600">Review your information before finishing</p>
      </div>

      <div className="space-y-4">
        {/* Profile Preview */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6] flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-gray-900">{formData.firstName} {formData.lastName}</h4>
              <p className="text-sm text-gray-600">{gradeLabel}</p>
            </div>
          </div>
        </Card>

        {/* Summary Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-600">Grade</Label>
            <p className="text-gray-900">{gradeLabel}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600">Session Duration</Label>
            <p className="text-gray-900">{formData.sessionDuration} minutes</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">
              Your profile is ready! Click <strong>Finish</strong> to continue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
