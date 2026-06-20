import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WeeklyEngagement, WalletSummary } from "../../../services/api/studentDashboard";

interface RightSidebarProps {
  walletBalance: number;
  walletSummary: WalletSummary;
  weeklyEngagement: WeeklyEngagement[];
}

export default function RightSidebar({
  walletBalance,
  walletSummary,
  weeklyEngagement,
}: RightSidebarProps) {
  const navigate = useNavigate();

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
              ${walletBalance.toFixed(2)}
            </div>
          </div>

          <div className="pt-4 border-t space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-600">Last Recharge</span>
              <span className="text-green-600">
                +${walletSummary.lastRechargeAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Last Session</span>
              <span className="text-red-600">
                -${Math.abs(walletSummary.lastSessionAmount).toFixed(2)}
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
          {weeklyEngagement.length > 0 ? (
            weeklyEngagement.map((d, index) => (
              <div key={`${d.day}-${index}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{d.day}</span>
                  <span
                    className={
                      d.avgFocusScore >= 90
                        ? "text-green-500"
                        : d.avgFocusScore < 80
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }
                  >
                    {Math.round(d.avgFocusScore)}%
                  </span>
                </div>
                <Progress value={d.avgFocusScore} className="h-2" />
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-4">No engagement data this week</div>
          )}
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
            onClick={() => navigate("/student/sessions")}
          >
            <FileText className="w-4 h-4 mr-2" />
            All Sessions
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/student/performance")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance Report
          </Button>

        </div>
      </Card>

    </div>
  );
}