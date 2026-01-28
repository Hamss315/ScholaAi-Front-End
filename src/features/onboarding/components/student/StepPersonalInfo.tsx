import { useRef } from "react";
import { Upload, User, Calendar } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import type { StudentOnboardingData } from "../../types/onboarding.types";
import { STUDENT_GRADE_OPTIONS } from "../../constants/onboarding.constants";

interface Props {
  formData: StudentOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<StudentOnboardingData>>;
}

export default function StepPersonalInfo({ formData, setFormData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        profileImage: (ev.target?.result as string) || null,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Basic Personal Information</h3>
        <p className="text-sm text-gray-600">Let’s start with the essentials</p>
      </div>

      {/* Photo */}
      <div className="flex flex-col items-center">
        <Label className="mb-2">Profile Photo (Optional)</Label>

        <div
          className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors border-4 border-[#3B82F6]"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.profileImage ? (
            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <Button variant="ghost" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
          {formData.profileImage ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullname">Full Name *</Label>
          <Input
            id="fullname"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="John Doe"
            className="mt-[5px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="gender" className="mb-[5px] block">
            Gender *
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Grade numeric (1..12) */}
        <div>
          <Label htmlFor="grade" className="mb-[5px] block">
            Grade *
          </Label>

          <Select
            value={formData.grade === null ? "" : String(formData.grade)}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                grade: value ? Number(value) : null,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>

            <SelectContent>
              {STUDENT_GRADE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="birthdate">Birthdate (Optional)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthdate: e.target.value }))}
              className="pl-10 mt-[5px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
