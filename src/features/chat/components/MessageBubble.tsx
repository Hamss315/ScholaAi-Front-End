import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import type { ChatMessage } from "../types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  avatarText?: string;
}

export default function MessageBubble({
  message,
  isMine,
  avatarText = "U",
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-3 max-w-[70%] ${isMine ? "flex-row-reverse" : ""}`}
      >
        <Avatar className="w-8 h-8">
          <AvatarFallback
            className={isMine ? "bg-[#3B82F6] text-white" : "bg-[#8B5CF6] text-white"}
          >
            {avatarText}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className={`text-xs text-gray-500 mb-1 ${isMine ? "text-right" : ""}`}>
            {new Date(message.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <div
            className={`p-3 rounded-lg ${
              isMine
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {message.messageType === "image" && message.attachmentURL ? (
              <img
                src={message.attachmentURL}
                alt="attachment"
                className="max-w-full rounded-md"
              />
            ) : (
              message.messageText
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
