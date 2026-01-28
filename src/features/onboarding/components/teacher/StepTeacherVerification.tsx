import { FileText, Upload, AlertCircle, CheckCircle2, Clock } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";

import type { TeacherOnboardingData } from "../../types/onboarding.types";

interface Props {
  formData: TeacherOnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<TeacherOnboardingData>>;
}

export default function StepTeacherVerification({ formData, setFormData }: Props) {
  const addCertificates = (files: File[]) => {
    setFormData((prev) => ({ ...prev, certificateFiles: [...prev.certificateFiles, ...files] }));
  };

  const removeCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificateFiles: prev.certificateFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Qualifications & Verification</h3>
        <p className="text-sm text-gray-600">Help us verify your credentials</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="mb-1">All documents will be reviewed by our team within 24-48 hours.</p>
            <p>Accepted formats: PDF, JPG, PNG (Max 5MB per file)</p>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Upload Certificates * (Degrees, certifications, credentials)</Label>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-1"
          onClick={() => {
            const input = document.getElementById("teacher-certs") as HTMLInputElement | null;
            input?.click();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Certificate Files
        </Button>

        <input
          id="teacher-certs"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => addCertificates(Array.from(e.target.files || []))}
        />

        {formData.certificateFiles.length > 0 && (
          <div className="space-y-2 mt-3">
            {formData.certificateFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCertificate(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Upload ID/Passport for Verification *</Label>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-1"
          onClick={() => {
            const input = document.getElementById("teacher-id") as HTMLInputElement | null;
            input?.click();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          {formData.idFile ? formData.idFile.name : "Choose ID Document"}
        </Button>

        <input
          id="teacher-id"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFormData((prev) => ({ ...prev, idFile: e.target.files?.[0] || null }))}
        />

        {formData.idFile && (
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">ID document uploaded</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 border rounded-lg">
        <Checkbox
          id="teacher-docs-confirm"
          checked={formData.documentsConfirmed}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, documentsConfirmed: checked === true }))
          }
        />
        <Label htmlFor="teacher-docs-confirm" className="text-sm cursor-pointer">
          I confirm all uploaded documents are authentic and belong to me.
        </Label>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">Status: Pending verification after submission</p>
        </div>
      </div>
    </div>
  );
}
