import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function UpcomingSessions({ sessions }: { sessions: any[] }) {
  return (
    <Card className="p-6">

      <h3 className="text-lg mb-4">Upcoming Sessions</h3>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="p-4 border rounded-lg">

            <div>{s.subject}</div>
            <div className="text-sm text-gray-600">{s.teacher}</div>

            <div className="flex justify-between mt-2">
              <span className="text-xs">{s.date}</span>
              <Badge>${s.price}</Badge>
            </div>

          </div>
        ))}
      </div>

    </Card>
  );
}