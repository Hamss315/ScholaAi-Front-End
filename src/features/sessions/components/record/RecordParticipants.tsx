import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { sessionData } from "../../data/recordData";
import { getInitials } from "../../../../utils/utils";

export default function RecordParticipants() {
  return (
    <div className="flex gap-4 mb-8">
      <Card className="flex-1 p-4 flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-[#3B82F6] text-white">
            {getInitials(sessionData.studentName) || sessionData.studentInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm text-gray-500">Student</div>
          <div style={{ color: '#1E3A8A' }}>{sessionData.studentName}</div>
        </div>
      </Card>
      <Card className="flex-1 p-4 flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-[#8B5CF6] text-white">
            {getInitials(sessionData.teacherName) || sessionData.teacherInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm text-gray-500">Teacher</div>
          <div style={{ color: '#1E3A8A' }}>{sessionData.teacherName}</div>
        </div>
      </Card>
    </div>
  );
}
