import { Send } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface Props {
  subject: string;
}

export default function RequestInfoBox({ subject }: Props) {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex gap-3">
        <Send className="w-5 h-5 mt-0.5" style={{ color: "#3B82F6" }} />
        <div className="text-sm text-gray-700">
          <p className="mb-2">When you submit this request:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All teachers who teach {subject || "your selected subject"} will be notified</li>
            <li>Teachers can accept or decline your request</li>
            <li>You’ll be notified when a teacher accepts</li>
            <li>The session will be scheduled after acceptance</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
