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

    return response.json();
  },

  async getMessages(otherUserId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${BASE_URL}/chat/messages/${otherUserId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  },

  async markAsRead(messageId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/chat/messages/${messageId}/read`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to mark message as read");
    }
  },
};
