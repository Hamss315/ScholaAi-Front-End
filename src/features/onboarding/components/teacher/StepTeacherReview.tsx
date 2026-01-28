import { CheckCircle2, User } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";

import type { TeacherOnboardingData } from "../../types/onboarding.types";

interface Props {
  formData: TeacherOnboardingData;
}

export default function StepTeacherReview({ formData }: Props) {
  const selectedSlotsCount = Object.values(formData.availability).flat().length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-green-600" />
        <h3 className="text-gray-900 mb-1">Profile Summary</h3>
        <p className="text-sm text-gray-600">Review your information before finishing</p>
      </div>

      <div className="space-y-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#3B82F6] flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-gray-900">{formData.fullName}</h4>
              <p className="text-sm text-gray-600">{formData.experience ? `${formData.experience} years experience` : ""}</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-600">Availability</Label>
            <p className="text-gray-900">{selectedSlotsCount} time slots</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-600">Subjects Teaching</Label>
            <div className="flex flex-wrap gap-2">
              {formData.selectedSubjects.map((s) => (
                <Badge key={s} className="bg-[#3B82F6]">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-600">Biography</Label>
            <p className="text-sm text-gray-700">{formData.biography}</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-600">Documents</Label>
            <p className="text-sm text-gray-700">
              {formData.certificateFiles.length} certificate(s) + {formData.idFile ? "ID uploaded" : "No ID"}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Verification Required:</strong> Your profile will be reviewed within 24-48 hours (demo copy).
          </p>
        </div>
      </div>
    </div>
  );
}
