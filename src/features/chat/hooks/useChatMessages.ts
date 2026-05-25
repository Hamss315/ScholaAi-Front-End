import { useCallback, useEffect, useState } from "react";
import { chatApi } from "../services/chatApi";
import type { ChatMessage } from "../types/chat";

interface UseChatMessagesParams {
  currentUserId: string;
  otherUserId: string;
}

export function useChatMessages({
  currentUserId,
  otherUserId,
}: UseChatMessagesParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    if (!otherUserId) return;

    try {
      setLoading(true);
      setError("");

      const data = await chatApi.getMessages(otherUserId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [otherUserId]);

  const addMessage = useCallback(
    (message: ChatMessage) => {
      const belongsToThisChat =
        (message.senderId === currentUserId &&
          message.receiverId === otherUserId) ||
        (message.senderId === otherUserId &&
          message.receiverId === currentUserId);

      if (!belongsToThisChat) return;

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => msg.messageId === message.messageId
        );

        if (alreadyExists) return prev;

        return [...prev, message];
      });
    },
    [currentUserId, otherUserId]
  );

  const replaceMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    loadMessages,
    addMessage,
    replaceMessages,
    clearMessages,
  };
}
