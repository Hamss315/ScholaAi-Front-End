import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

type UserInfo = {
  fullName: string;
  email: string;
  status: string;
  role?: string;
};

type Props = {
  userData: UserInfo | null;
};

export default function UserInfoCard({ userData }: Props) {
  if (!userData) return null;
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-1">{userData.fullName}</h3>
      <p className="text-sm text-gray-600 mb-2">{userData.email}</p>
      <div className="flex gap-2">
        <Badge className={userData.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
          {userData.status}
        </Badge>
        {userData.role && (
          <Badge className="bg-blue-100 text-blue-700">{userData.role}</Badge>
        )}
      </div>
    </Card>
  );
}
