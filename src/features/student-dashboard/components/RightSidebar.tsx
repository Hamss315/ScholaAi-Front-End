import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../payment/services/payment.service";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [lastCredit, setLastCredit] = useState<number | null>(null);
  const [lastDebit, setLastDebit] = useState<number | null>(null);

  useEffect(() => {
    paymentService.getWalletBalance()
      .then((data) => setBalance(data.balance))
      .catch((err) => console.error("Failed to load balance:", err));

    paymentService.getTransactions()
      .then((txs) => {
        const credit = txs.find((t) => t.type === "credit");
        if (credit) setLastCredit(credit.amount);

        const debit = txs.find((t) => t.type === "debit");
        if (debit) setLastDebit(debit.amount);
      })
      .catch((err) => console.error("Failed to load transactions:", err));
  }, []);

  return (
    <div className="space-y-6">

      {/* Wallet */}
      <Card className="p-6">
        <h3 className="text-[#1E3A8A] mb-4">
          Wallet Balance
        </h3>

        <div className="space-y-4">

          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white">
            <div className="text-sm opacity-90 mb-1">
              Available Balance
            </div>
            <div className="text-3xl mb-2">
              ${balance !== null ? balance.toFixed(2) : "..."}
            </div>
          </div>

          <div className="pt-4 border-t space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-600">Last Recharge</span>
              <span className="text-green-600">
                {lastCredit !== null ? `+$${lastCredit.toFixed(2)}` : "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Last Session</span>
              <span className="text-red-600">
                {lastDebit !== null ? `-$${lastDebit.toFixed(2)}` : "N/A"}
              </span>
            </div>

          </div>

          <Button
            variant="outline"
            className="w-full border-[#1E3A8A] text-[#1E3A8A]"
            onClick={() => navigate("/payment")}
          >
            Recharge Wallet
          </Button>

        </div>
      </Card>

      {/* Weekly Engagement */}
      <Card className="p-6">
        <h3 className="text-[#1E3A8A] mb-4">
          Weekly Engagement
        </h3>

        <div className="space-y-3">

          {[
            { day: "Monday", value: 95 },
            { day: "Tuesday", value: 88 },
            { day: "Wednesday", value: 92 },
            { day: "Thursday", value: 78 },
            { day: "Friday", value: 94 },
          ].map((d) => (
            <div key={d.day}>

              <div className="flex justify-between text-sm mb-1">
                <span>{d.day}</span>
                <span
                  className={
                    d.value >= 90
                      ? "text-green-500"
                      : d.value < 80
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }
                >
                  {d.value}%
                </span>
              </div>

              <Progress value={d.value} className="h-2" />

            </div>
          ))}

        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-[#1E3A8A] mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/student/calendar")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Full Calendar
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            All Notes
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance Report
          </Button>

        </div>
      </Card>

    </div>
  );
}