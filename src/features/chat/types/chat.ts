export type UserRole = "student" | "teacher" | "admin";

export interface ChatConversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole: "student" | "teacher";
  subject?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online: boolean;
  avatar?: string;
  activeSessionId?: number;
}

export interface ChatMessage {
  messageId: number;
  senderId: string;
  receiverId: string;
  messageText: string | null;
  attachmentURL: string | null;
  messageType: "text" | "image";
  isRead: boolean;
  sentAt: string;
  sender: unknown | null;
  receiver: unknown | null;
}
