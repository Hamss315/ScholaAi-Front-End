import { useMemo, useState } from "react";
import { Brain, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";

import StepTeacherPersonalInfo from "./StepTeacherPersonalInfo";
import StepTeacherProfessionalInfo from "./StepTeacherProfessionalInfo";
import StepTeacherVerification from "./StepTeacherVerification";
import StepTeacherPricingSchedule from "./StepTeacherPricingSchedule";
import StepTeacherDeviceCheck from "./StepTeacherDeviceCheck";
import StepTeacherReview from "./StepTeacherReview";

import type { TeacherOnboardingData } from "../../types/onboarding.types";

interface Props {
  fullName: string;
  email?: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 6;

export default function TeacherOnboarding({ fullName, email, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<TeacherOnboardingData>({
    fullName: fullName || "",
    email,

    profileImage: null,

    gender: "",
    biography: "",

    selectedSubjects: [],
    experience: "",

    certificateFiles: [],
    idFile: null,
    documentsConfirmed: false,

    hourlyRate: "",
    availability: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    openForImmediate: false,
  });

  const progressPercentage = useMemo(() => (currentStep / TOTAL_STEPS) * 100, [currentStep]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName.trim().length > 0 &&
          formData.gender.trim().length > 0 &&
          formData.biography.trim().length >= 20
        );
      case 2:
        return formData.selectedSubjects.length > 0 && formData.experience.length > 0;
      case 3:
        return formData.certificateFiles.length > 0 && formData.idFile !== null && formData.documentsConfirmed;
      case 4: {
        const selectedSlotsCount = Object.values(formData.availability).flat().length;
        return selectedSlotsCount >= 3;
      }
      case 5:
        return true; // prototype mode device check
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Finish (no saving for now)
    // console.log("Teacher onboarding data:", formData);

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-10 h-10" style={{ color: "#8B5CF6" }} />
            <span className="text-3xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
          </div>
          <h2 className="text-gray-900 mb-1">Complete Your Teacher Profile</h2>
          <p className="text-gray-600 text-sm">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={currentStep >= 1 ? "text-[#3B82F6]" : ""}>Personal</span>
            <span className={currentStep >= 2 ? "text-[#3B82F6]" : ""}>Professional</span>
            <span className={currentStep >= 3 ? "text-[#3B82F6]" : ""}>Verification</span>
            <span className={currentStep >= 4 ? "text-[#3B82F6]" : ""}>Schedule</span>
            <span className={currentStep >= 5 ? "text-[#3B82F6]" : ""}>Setup</span>
            <span className={currentStep >= 6 ? "text-[#3B82F6]" : ""}>Review</span>
          </div>
        </div>

        {/* Card */}
        <Card className="p-8 shadow-xl">
          {currentStep === 1 && <StepTeacherPersonalInfo formData={formData} setFormData={setFormData} />}

          {currentStep === 2 && (
            <StepTeacherProfessionalInfo formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 3 && <StepTeacherVerification formData={formData} setFormData={setFormData} />}

          {currentStep === 4 && (
            <StepTeacherPricingSchedule formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 5 && (
            <StepTeacherDeviceCheck
              cameraPermission={cameraPermission}
              micPermission={micPermission}
              setCameraPermission={setCameraPermission}
              setMicPermission={setMicPermission}
            />
          )}

          {currentStep === 6 && <StepTeacherReview formData={formData} />}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              {currentStep === TOTAL_STEPS ? (
                <>
                  Finish
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
