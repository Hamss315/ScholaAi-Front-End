import { useEffect, useState } from "react";
import { Brain, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import MannersAlert from "../components/MannersAlert";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import MessageInput from "../components/MessageInput";
import ConnectionStatus from "../components/ConnectionStatus";
import { chatApi } from "../services/chatApi";
import { signalrService } from "../services/signalrService";
import { useChatConnection } from "../hooks/useChatConnection";
import type { ChatConversation, ChatMessage, UserRole } from "../types/chat";

interface ChatPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole: UserRole | null;
  selectedChat?: ChatConversation;
  currentUserId: string;
  currentUserName: string;
}

export default function ChatPage({
  onNavigate,
  userRole,
  selectedChat,
  currentUserId,
  currentUserName,
}: ChatPageProps) {
  const [showMannerAlert, setShowMannerAlert] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";
  const { isConnected, isReconnecting } = useChatConnection(token);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?.otherUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await chatApi.getMessages(selectedChat.otherUserId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedChat?.otherUserId]);

  useEffect(() => {
    if (!selectedChat?.otherUserId) return;

    const handleIncomingMessage = (message: ChatMessage) => {
      const belongsToThisChat =
        (message.senderId === currentUserId &&
          message.receiverId === selectedChat.otherUserId) ||
        (message.senderId === selectedChat.otherUserId &&
          message.receiverId === currentUserId);

      if (!belongsToThisChat) return;

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => msg.messageId === message.messageId
        );

        if (alreadyExists) return prev;

        return [...prev, message];
      });
    };

    signalrService.onReceiveMessage(handleIncomingMessage);

    return () => {
      signalrService.offReceiveMessage(handleIncomingMessage);
    };
  }, [currentUserId, selectedChat?.otherUserId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChat?.otherUserId) return;

    try {
      await signalrService.sendPrivateMessage(selectedChat.otherUserId, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-[#8B5CF6]" />
                <span className="text-2xl text-[#1E3A8A]">ScholaAi</span>
              </div>

              <Button variant="ghost" onClick={() => onNavigate("chats-list")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Messages
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus
                isConnected={isConnected}
                isReconnecting={isReconnecting}
              />

              <Avatar>
                <AvatarFallback
                  className={
                    userRole === "teacher"
                      ? "bg-[#8B5CF6] text-white"
                      : "bg-[#3B82F6] text-white"
                  }
                >
                  {userRole === "teacher" ? "T" : "S"}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("landing")}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {showMannerAlert && (
          <MannersAlert onAcknowledge={() => setShowMannerAlert(false)} />
        )}

        <ChatHeader
          name={selectedChat?.otherUserName || "Chat"}
          subtitle={
            selectedChat?.subject
              ? `${selectedChat.subject} ${
                  selectedChat.otherUserRole === "teacher" ? "Teacher" : "Student"
                }`
              : selectedChat?.otherUserRole || ""
          }
          avatar={selectedChat?.avatar || "U"}
        />

        <Card className="p-6 h-[600px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Loading messages...
            </div>
          ) : (
            <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              otherUserName={selectedChat?.otherUserName || "User"}
            />
          )}

          <MessageInput
            onSend={handleSendMessage}
            disabled={showMannerAlert || !isConnected || !selectedChat}
          />
        </Card>
      </div>
    </div>
  );
}
