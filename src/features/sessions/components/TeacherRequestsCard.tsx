import { Calendar, Clock, BookOpen, Check, X, MessageSquare } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import type { SessionRequest } from "../types/session.types";

interface Props {
  request: SessionRequest;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onMessageStudent?: (id: number) => void; // optional
}

export default function TeacherRequestCard({ request, onAccept, onDecline, onMessageStudent }: Props) {
  const statusClass =
    request.status === "pending"
      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      : request.status === "accepted"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-gray-100 text-gray-700 hover:bg-gray-100";

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-[#3B82F6] text-white">
              {request.studentInitials}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="text-xl mb-1" style={{ color: "#1E3A8A" }}>
              {request.studentName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              {request.subject}
            </div>
          </div>
        </div>

        <Badge className={statusClass}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">Preferred Date:</span>
          <span className="font-medium">{request.preferredDate}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">Time:</span>
          <span className="font-medium">
            {request.preferredTime} ({request.duration})
          </span>
        </div>
      </div>

      {!!request.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Student Notes:</div>
          <div className="text-gray-700">{request.notes}</div>
        </div>
      )}

      <div className="text-sm text-gray-500 mb-4">Requested on {request.requestedDate}</div>

      {request.status === "pending" && (
        <div className="flex gap-3">
          <Button onClick={() => onAccept(request.id)} className="flex-1 bg-[#22C55E] hover:bg-[#22C55E]/90">
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>

          <Button
            onClick={() => onDecline(request.id)}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      )}

      {request.status === "accepted" && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onMessageStudent?.(request.id)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message Student
        </Button>
      )}
    </Card>
  );
}
