import { History, TrendingUp, Wallet } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function TransactionList({ transactions }: any) {
  return (
    <Card className="p-6">

      <div className="flex items-center gap-2 mb-6">
        <History className="w-6 h-6" style={{ color: '#3B82F6' }} />
        <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>
          Transaction History
        </h2>
      </div>

      <div className="space-y-3">
        {transactions.map((t: any) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">

                {/* ✅ ICON FIX */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === "credit" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {t.type === "credit" ? (
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "#22C55E" }}
                    />
                  ) : (
                    <Wallet
                      className="w-5 h-5"
                      style={{ color: "#EF4444" }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-gray-900">{t.description}</div>
                  <div className="text-sm text-gray-500">{t.date}</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-lg ${
                  t.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {t.type === "credit" ? "+" : "-"}${t.amount}
              </div>
              <div className="text-xs text-gray-500">
                Bal: ${t.balance}
              </div>
            </div>
          </div>
        ))}
      </div>

    </Card>
  );
}