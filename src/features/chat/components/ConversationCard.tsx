import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Video } from "lucide-react";
import type { ChatConversation, UserRole } from "../types/chat";

interface ConversationCardProps {
  conversation: ChatConversation;
  userRole: UserRole | null;
  onClick: () => void;
  onStartSession?: (e: React.MouseEvent) => void;
}

export default function ConversationCard({
  conversation,
  userRole,
  onClick,
  onStartSession,
}: ConversationCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="w-14 h-14">
              <AvatarFallback
                className={userRole === "teacher" ? "bg-[#3B82F6] text-white" : "bg-[#8B5CF6] text-white"}
              >
                {conversation.avatar || "U"}
              </AvatarFallback>
            </Avatar>

            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-[#1E3A8A]">
                {conversation.otherUserName}
              </h3>
              <span className="text-sm text-gray-500">
                {conversation.lastMessageTime || ""}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              {conversation.subject && (
                <Badge className={userRole === "teacher" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                  {conversation.subject}
                </Badge>
              )}

              <span className="text-xs text-gray-500 capitalize">
                {conversation.otherUserRole}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p
                className={`text-sm truncate ${
                  conversation.unreadCount > 0
                    ? "font-medium text-gray-900"
                    : "text-gray-600"
                }`}
              >
                {conversation.lastMessage || "No messages yet"}
              </p>

              {conversation.unreadCount > 0 && (
                <Badge className="bg-[#3B82F6] text-white ml-2 shrink-0">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {((userRole === "teacher") || (userRole === "student" && conversation.activeSessionId)) && onStartSession && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStartSession(e);
            }}
            className={`ml-4 ${
              conversation.activeSessionId
                ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                : "bg-[#22C55E] hover:bg-[#22C55E]/90"
            } text-white font-semibold flex items-center gap-1 shrink-0`}
          >
            <Video className="w-4 h-4" />
            {conversation.activeSessionId ? "Join Session" : "Start Session"}
          </Button>
        )}
      </div>
    </div>
  );
}
