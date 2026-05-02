import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { BookOpen } from "lucide-react";
import type { RecentNote } from "../types/dashboard.types";

export default function RecentNotes({
  notes,
}: {
  notes: RecentNote[];
}) {
  return (
    <Card className="p-6">

      <h2 className="text-2xl mb-6 text-[#1E3A8A]">
        Recent Notes
      </h2>

      <div className="space-y-4">

        {notes.map((n) => (
          <div
            key={n.id}
            className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer"
          >

            <div className="flex justify-between mb-2">
              <div>
                <div className="text-[#1E3A8A]">{n.title}</div>
                <div className="text-sm text-gray-500">
                  {n.subject} · {n.date}
                </div>
              </div>

              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-600">
                Focus Score:
              </span>

              <Progress value={n.focusScore} className="flex-1" />

              <span
                className={`text-sm ${
                  n.focusScore >= 90
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {n.focusScore}%
              </span>

            </div>

          </div>
        ))}

      </div>

    </Card>
  );
}