import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { getInitials } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

type Props = {
  profileData: {
    firstName: string;
    lastName: string;
    grade: string;
  };
  sessionStats: {
    totalSessions: number;
    totalHours: number;
    averageFocus: number;
  };
  subscriptionData: {
    lastTopUp: Date;
    balance: number;
    status: string;
    currency: string;
  };
};

export default function StudentProfileSidebar({
  profileData,
  sessionStats,
  subscriptionData,
}: Props) {
  const navigate = useNavigate();

  const initials = getInitials(undefined, profileData.firstName, profileData.lastName) || "ST";

  return (
    <aside className="md:col-span-1">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="bg-[#8B5CF6] text-white text-3xl">{initials}</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl mb-1" style={{ color: "#1E3A8A" }}>
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p className="text-gray-600 mb-1">{profileData.grade}</p>

          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            {subscriptionData.status}
          </Badge>

          <Separator className="my-4 w-full" />

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Sessions</span>
              <span className="font-semibold" style={{ color: "#1E3A8A" }}>
                {sessionStats.totalSessions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Hours</span>
              <span className="font-semibold" style={{ color: "#1E3A8A" }}>
                {sessionStats.totalHours}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Focus</span>
              <span className="font-semibold" style={{ color: "#22C55E" }}>
                {sessionStats.averageFocus}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-xl mb-4" style={{ color: "#1E3A8A" }}>
          My Wallet
        </h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-3xl" style={{ color: "#22C55E" }}>
              {subscriptionData.balance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Top-up</p>
            <p  style={{ color: "#1E3A8A" }}>
              {subscriptionData.lastTopUp.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Currency</p>
            <p>{subscriptionData.currency}</p>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          style={{ backgroundColor: "#3B82F6" }}
          onClick={() => navigate("/payment")}
        >
          Add Funds
        </Button>
      </Card>
    </aside>
  );
}
