import { useRef } from "react";
import { Upload, User } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

import type { TeacherOnboardingData } from "../../types/onboarding.types";

interface Props {
  formData: TeacherOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<TeacherOnboardingData>>;
}

export default function StepTeacherPersonalInfo({ formData, setFormData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, profileImage: (ev.target?.result as string) || null }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Basic Personal Information</h3>
        <p className="text-sm text-gray-600">Let students know who you are</p>
      </div>

      {/* Photo */}
      <div className="flex flex-col items-center">
        <Label className="mb-2">Profile Photo *</Label>

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

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        <Button variant="ghost" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
          {formData.profileImage ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullname" className="mb-1 block">
            Full Name *
          </Label>
          <Input
            id="fullname"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Dr. Jane Smith"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="gender" className="mb-1 block">
            Gender *
          </Label>

          <Select value={formData.gender} onValueChange={(value) => setFormData((p) => ({ ...p, gender: value as any }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="biography" className="mb-1 block">
          Description * (min 20 characters)
        </Label>
        <Textarea
          id="biography"
          value={formData.biography}
          onChange={(e) => setFormData((prev) => ({ ...prev, biography: e.target.value }))}
          placeholder="Tell students about your teaching background and what makes your sessions effective..."
          rows={4}
          className="mt-1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{formData.biography.length}/200 characters</p>
      </div>
    </div>
  );
}
