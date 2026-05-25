import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function EditModeBanner() {
  return (
    <Card className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <div className="flex items-start gap-3">
        <Edit2 className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">
            Edit Mode Active
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Click on any time slot to toggle your availability.
          </p>
        </div>
      </div>
    </Card>
  );
}