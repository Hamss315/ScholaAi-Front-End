import { History, TrendingUp, Wallet } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function TransactionList({
  transactions,
}: {
  transactions: any[];
}) {
  return (
    <Card className="p-6">

      <h2 className="text-2xl mb-6 flex items-center gap-2">
        <History className="w-5 h-5" />
        Transaction History
      </h2>

      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="flex justify-between p-4 border rounded-lg">

            <div className="flex gap-3">
              {t.type === "credit" ? (
                <TrendingUp />
              ) : (
                <Wallet />
              )}

              <div>
                <div>{t.description}</div>
                <div className="text-sm text-gray-500">{t.date}</div>
              </div>
            </div>

            <div className={t.type === "credit" ? "text-green-600" : "text-red-600"}>
              {t.type === "credit" ? "+" : "-"}${t.amount}
            </div>

          </div>
        ))}
      </div>

    </Card>
  );
}