import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import { getUserIdFromToken, getRoleFromToken } from "../../../utils/jwt";
import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

interface ChatPageProps {
  userRole?: UserRole | null;
  selectedChat?: ChatConversation;
  currentUserId?: string;
  currentUserName?: string;
  onNavigate?: (page: string) => void;
}

export default function ChatPage({
  userRole: propUserRole,
  selectedChat: propSelectedChat,
  currentUserId: propUserId,
  currentUserName: propUserName,
  onNavigate,
}: ChatPageProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = getInitials(user?.userName, user?.firstName, user?.lastName) || (propUserRole || getRoleFromToken(localStorage.getItem("token") || localStorage.getItem("scholaai_token") || "") === "teacher" ? "T" : "S");

  const [showMannerAlert, setShowMannerAlert] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedChat, setSelectedChat] = useState<ChatConversation | undefined>(
    propSelectedChat || location.state?.chat
  );

  const token = localStorage.getItem("token") || localStorage.getItem("scholaai_token") || "";
  const { isConnected, isReconnecting } = useChatConnection(token);

  const currentUserId = propUserId || localStorage.getItem("userId") || getUserIdFromToken(token) || "";
  const currentUserName = propUserName || localStorage.getItem("userName") || "User";
  const userRole = propUserRole || getRoleFromToken(token) || "student";

  // Resolve selectedChat metadata dynamically if page is directly loaded/refreshed
  useEffect(() => {
    const resolveChatMetadata = async () => {
      if (selectedChat || !chatId) return;

      try {
        const conversations = await chatApi.getConversations();
        const found = conversations.find(c => c.otherUserId === chatId);
        if (found) {
          setSelectedChat(found);
        } else {
          // Fallback metadata if conversation is new/empty
          setSelectedChat({
            id: "0",
            otherUserId: chatId,
            otherUserName: "Chat Partner",
            otherUserRole: userRole === "teacher" ? "student" : "teacher",
            avatar: "U",
            subject: "",
            lastMessage: "",
            lastMessageTime: "",
            unreadCount: 0,
            online: false,
          });
        }
      } catch (err) {
        console.error("Failed to load chat conversation metadata:", err);
      }
    };

    resolveChatMetadata();
  }, [chatId, selectedChat, userRole]);

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
        await chatApi.markAsRead(selectedChat.otherUserId);
      } catch (error) {
        console.error("Failed to load messages or mark as read:", error);
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

      if (message.senderId === selectedChat.otherUserId) {
        chatApi.markAsRead(selectedChat.otherUserId).catch((err) => {
          console.error("Failed to mark incoming message as read:", err);
        });
      }
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

              <Button
                variant="ghost"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("chats-list");
                  } else {
                    navigate("/chats");
                  }
                }}
              >
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
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("home");
                  } else {
                    navigate("/");
                  }
                }}
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
