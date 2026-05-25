import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function UpcomingSessions({ sessions }: any) {
  return (
    <div className="space-y-6">

      {/* Main Card */}
      <Card className="p-6">
        <h3 className="text-lg mb-4" style={{ color: '#1E3A8A' }}>
          Upcoming Sessions
        </h3>

        <div className="space-y-3">
          {sessions.map((s: any) => (
            <div key={s.id} className="p-4 border rounded-lg">
              <div className="text-gray-900 mb-1">{s.subject}</div>
              <div className="text-sm text-gray-600 mb-2">{s.teacher}</div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">{s.date}</div>
                <Badge className="bg-[#22C55E] hover:bg-[#22C55E]">
                  ${s.price}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Cost</span>
            <span className="text-lg" style={{ color: '#1E3A8A' }}>
              ${sessions.reduce((sum: number, s: any) => sum + s.price, 0)}
            </span>
          </div>

          {/* ✅ MISSING TEXT FIX */}
          <p className="text-xs text-gray-500 mt-2">
            Amount will be deducted from your wallet at the time of each session.
          </p>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Recharge your wallet with any amount</li>
            <li>Each session has its own price set by the teacher</li>
            <li>Payment is deducted automatically when session starts</li>
            <li>Unused balance remains in your wallet</li>
          </ul>
        </div>
      </Card>

    </div>
  );
}