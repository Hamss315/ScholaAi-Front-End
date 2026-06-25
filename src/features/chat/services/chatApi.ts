import api from "../../../services/api";
import type { ChatConversation, ChatMessage } from "../types/chat";
import { getRoleFromToken } from "../../../utils/jwt";
import { getInitials } from "../../../utils/utils";

export const chatApi = {
  async getConversations(): Promise<ChatConversation[]> {
    const response = await api.get<any[]>("/chat/conversations");
    const token = localStorage.getItem("token") || localStorage.getItem("scholaai_token") || "";
    const userRole = getRoleFromToken(token) || "student";
    const otherRole = userRole === "teacher" ? "student" : "teacher";

    return response.data.map((c: any) => ({
      id: c.otherUserId,
      otherUserId: c.otherUserId,
      otherUserName: c.otherUserName,
      otherUserRole: (c.otherUserRole && c.otherUserRole !== "") ? c.otherUserRole : otherRole,
      lastMessage: c.lastMessageText || "",
      lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      unreadCount: c.unreadCount,
      online: false,
      avatar: getInitials(c.otherUserName) || "U",
    }));
  },

  async getMessages(otherUserId: string): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>(`/chat/history/${otherUserId}`);
    return response.data;
  },

  async markAsRead(senderId: string): Promise<void> {
    await api.post(`/chat/read/${senderId}`);
  },
};
