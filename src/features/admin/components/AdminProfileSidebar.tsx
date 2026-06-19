import { Mail, Phone, Globe, Shield } from "lucide-react";

import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";

import type { AdminProfileData, PlatformStats } from "../types/profile";

type Props = {
  profileData: AdminProfileData;
  platformStats: PlatformStats;
  initials?: string;
};

export default function AdminProfileSidebar({
  profileData,
  platformStats,
  initials = "AU",
}: Props) {
  return (
    <aside className="md:col-span-1">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="bg-[#EF4444] text-white text-3xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl mb-1" style={{ color: "#1E3A8A" }}>
            {profileData.name}
          </h2>
          <p className="text-gray-600 mb-1">{profileData.role}</p>

          <div className="flex items-center gap-1 mb-4">
            <Shield className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} />
            <span className="text-sm text-gray-600">System Administrator</span>
          </div>

          <Separator className="my-4 w-full" />

          <div className="w-full space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-600">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-600">{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-600">{profileData.location}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="mb-4" style={{ color: "#1E3A8A" }}>
          Platform Overview
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Users</span>
            <Badge className="bg-blue-100 text-blue-700">{platformStats.totalUsers}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Teachers</span>
            <Badge className="bg-purple-100 text-purple-700">{platformStats.totalTeachers}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Students</span>
            <Badge className="bg-green-100 text-green-700">{platformStats.totalStudents}</Badge>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Sessions</span>
            <span style={{ color: "#1E3A8A" }}>{platformStats.totalSessions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Revenue</span>
            <span style={{ color: "#22C55E" }}>{platformStats.monthlyRevenue}</span>
          </div>
        </div>
      </Card>
    </aside>
  );
}
