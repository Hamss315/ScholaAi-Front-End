import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import MessageBubble from "./MessageBubble";
import { getInitials } from "../../../utils/utils";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  otherUserName: string;
}

export default function ChatMessages({
  messages,
  currentUserId,
  currentUserName,
  otherUserName,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Start your conversation.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;
        const avatarText = getInitials(isMine ? currentUserName : otherUserName);

        return (
          <MessageBubble
            key={msg.messageId}
            message={msg}
            isMine={isMine}
            avatarText={avatarText}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
