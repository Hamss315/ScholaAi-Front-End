import { History } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface PayoutHistoryItem {
  id: number;
  amount: number;
  method: string;
  status: string;
  date: string;
  transactionId: string;
}

interface PayoutHistoryProps {
  history: PayoutHistoryItem[];
}

export default function PayoutHistory({ history }: PayoutHistoryProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" style={{ color: "#3B82F6" }} />
        <h3 className="text-lg font-semibold" style={{ color: "#1E3A8A" }}>
          Recent Payouts
        </h3>
      </div>
      <div className="space-y-3">
        {history.map((payout) => (
          <div
            key={payout.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    payout.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-sm font-semibold">{payout.amount} EGP</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{payout.date}</div>
            </div>
            <Badge
              variant="outline"
              className={
                payout.status === "Completed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            >
              {payout.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
