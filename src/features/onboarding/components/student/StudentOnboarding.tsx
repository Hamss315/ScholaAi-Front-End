import { useMemo, useState } from "react";
import { Brain, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";

import StepPersonalInfo from "../student/StepPersonalInfo";
import StepDeviceCheck from "../student/StepDeviceCheck";
import StepPreferences from "../student/StepPreferences";
import StepConfirmation from "../student/StepConfirmation";

import type { StudentOnboardingData } from "../../types/onboarding.types";

interface Props {
  fullName: string;
  email?: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

export default function StudentOnboarding({ fullName, email, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<StudentOnboardingData>({
    fullName: fullName || "",
    email,

    profileImage: null,

    gender: "",
    birthdate: "",
    grade: null, // ✅ numeric

    selectedSubjects: [],
    sessionDuration: "45",

    availability: {},
  });

  const progressPercentage = useMemo(() => (currentStep / TOTAL_STEPS) * 100, [currentStep]);

  // ✅ This is why your Continue/Finish was disabled before:
  // you were checking fields you removed or were using string methods on grade.
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName.trim().length > 0 &&
          formData.gender.trim().length > 0 &&
          formData.grade !== null
        );

      case 2:
        return true; // ✅ device step never blocks (prototype)

      case 3:
        return (
          formData.sessionDuration.length > 0
        );

      case 4:
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

    // Finish: no saving for now
    // console.log("Student onboarding:", formData);

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-10 h-10" style={{ color: "#8B5CF6" }} />
            <span className="text-3xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
          </div>
          <h2 className="text-gray-900 mb-1">Complete Your Student Profile</h2>
          <p className="text-gray-600 text-sm">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={currentStep >= 1 ? "text-[#3B82F6]" : ""}>Personal Info</span>
            <span className={currentStep >= 2 ? "text-[#3B82F6]" : ""}>Device Check</span>
            <span className={currentStep >= 3 ? "text-[#3B82F6]" : ""}>Preferences</span>
            <span className={currentStep >= 4 ? "text-[#3B82F6]" : ""}>Confirmation</span>
          </div>
        </div>

        {/* Card */}
        <Card className="p-8 shadow-xl">
          {currentStep === 1 && <StepPersonalInfo formData={formData} setFormData={setFormData} />}

          {currentStep === 2 && (
            <StepDeviceCheck
              cameraPermission={cameraPermission}
              micPermission={micPermission}
              setCameraPermission={setCameraPermission}
              setMicPermission={setMicPermission}
            />
          )}

          {currentStep === 3 && <StepPreferences formData={formData} setFormData={setFormData} />}

          {currentStep === 4 && <StepConfirmation formData={formData} />}

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
