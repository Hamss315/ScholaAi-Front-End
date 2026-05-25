import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";

interface MannersAlertProps {
  onAcknowledge: () => void;
}

export default function MannersAlert({ onAcknowledge }: MannersAlertProps) {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <AlertCircle className="h-5 w-5 text-blue-500" />
      <AlertTitle className="text-lg text-[#1E3A8A]">
        Please Observe Public Manners
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-gray-700 mb-3">
          This is a professional educational platform. Please maintain respectful communication at all times:
        </p>

        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
          <li>Be respectful and courteous to teachers and students</li>
          <li>Keep conversations relevant to educational topics</li>
          <li>No inappropriate language or content</li>
          <li>Respect privacy and confidentiality</li>
          <li>Report any inappropriate behavior to administrators</li>
        </ul>

        <Button
          onClick={onAcknowledge}
          className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
        >
          I Understand
        </Button>
      </AlertDescription>
    </Alert>
  );
}
