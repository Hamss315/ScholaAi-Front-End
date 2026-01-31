import { Star } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";

import type { TeacherProfileData, TeacherProfessionalData, TeacherWorkSummary } from "../types/profile";

type Props = {
  profileData: TeacherProfileData;
  professionalData: TeacherProfessionalData;
  workSummary: TeacherWorkSummary;
};

export default function TeacherProfileSidebar({ profileData, professionalData, workSummary }: Props) {
  return (
    <div className="md:col-span-1">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="bg-[#8B5CF6] text-white text-3xl">SR</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl mb-1" style={{ color: "#1E3A8A" }}>
            {profileData.firstName} {profileData.lastName}
          </h2>

          <p className="text-gray-600 mb-1">{professionalData.education.split(",")[0]}</p>

          <div className="flex items-center gap-1 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
            <span className="text-xl" style={{ color: "#1E3A8A" }}>
              {workSummary.averageRating}
            </span>
            <span className="text-gray-600">({workSummary.totalReviews} reviews)</span>
          </div>

          <Separator className="my-4 w-full" />

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="text-xl" style={{ color: "#22C55E" }}>
                {professionalData.hourlyRate}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Experience</span>
              <span className="font-semibold" style={{ color: "#1E3A8A" }}>
                {professionalData.experience}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Students</span>
              <span className="font-semibold" style={{ color: "#8B5CF6" }}>
                {workSummary.activeStudents}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-xl mb-4" style={{ color: "#1E3A8A" }}>
          Work Summary
        </h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Total Hours Taught</p>
            <p className="text-2xl" style={{ color: "#8B5CF6" }}>
              {workSummary.totalHoursTaught}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl" style={{ color: "#22C55E" }}>
              {workSummary.totalEarnings}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-xl" style={{ color: "#3B82F6" }}>
              {workSummary.thisMonthEarnings}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-xl mb-4" style={{ color: "#1E3A8A" }}>
          Teaching Subjects
        </h3>

        <div className="flex flex-wrap gap-2">
          {professionalData.subjects.map((subject, index) => (
            <Badge key={index} className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              {subject}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
