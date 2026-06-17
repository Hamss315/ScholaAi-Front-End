import type { ChatConversation, ChatMessage } from "../types/chat";

const BASE_URL = "http://localhost:5254/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const chatApi = {
  async getConversations(): Promise<ChatConversation[]> {
    const response = await fetch(`${BASE_URL}/chat/conversations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();
    return data.map((c: any) => ({
      id: c.otherUserId,
      otherUserId: c.otherUserId,
      otherUserName: c.otherUserName,
      otherUserRole: c.otherUserRole,
      unreadCount: c.unreadCount,
      lastMessage: c.lastMessageText,
      lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      online: false,
    }));
  },

  async getMessages(otherUserId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${BASE_URL}/chat/history/${otherUserId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  },

  async markAsRead(senderId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/chat/read/${senderId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to mark messages as read");
    }
  },
};
