import { Check } from "lucide-react";

export default function ScheduleLegend() {
  return (
    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-green-100 border border-green-400 flex items-center justify-center">
          <Check className="w-4 h-4 text-green-600" />
        </div>
        <span className="text-sm text-gray-600">Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200" />
        <span className="text-sm text-gray-600">Not Available</span>
      </div>

    </div>
  );
}