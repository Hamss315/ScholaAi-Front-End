import { useEffect, useState } from "react";
import {
  Brain,
  ArrowLeft,
  MessageSquare,
  Search,
  Video,
  Calendar,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";

import ConversationCard from "../components/ConversationCard";
import { chatApi } from "../services/chatApi";
import type { ChatConversation, UserRole } from "../types/chat";
import { getRoleFromToken } from "../../../utils/jwt";

interface ChatsListPageProps {
  userRole?: UserRole | null;
}

export default function ChatsListPage({ userRole: propRole }: ChatsListPageProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("scholaai_token") || "";
  const userRole = propRole || getRoleFromToken(token) || "student";

  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await chatApi.getConversations();
        setChats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.subject || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = chats.reduce(
    (sum, chat) => sum + chat.unreadCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(userRole === "teacher"
                ? "/teacher/dashboard"
                : "/student/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-[#8B5CF6]" />
                <span className="text-2xl text-[#1E3A8A]">
                  ScholaAi
                </span>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

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
                onClick={() => navigate("/")}
              >
                <LogOut className="w-5 h-5" />
              </Button>

            </div>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* TITLE */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">

            <div>
              <h1 className="text-4xl mb-2 text-[#1E3A8A]">
                Messages
              </h1>

              <p className="text-gray-600">
                {userRole === "teacher"
                  ? "Chat with your students"
                  : "Chat with your teachers"}
              </p>
            </div>

            {totalUnread > 0 && (
              <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                {totalUnread} unread
              </Badge>
            )}

          </div>
        </div>

        {/* SEARCH */}
        <Card className="p-4 mb-4">
          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <Input
              placeholder={`Search ${
                userRole === "teacher"
                  ? "students"
                  : "teachers"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />

          </div>
        </Card>

        {/* CHAT LIST */}
        <Card className="divide-y">

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading conversations...
            </div>

          ) : filteredChats.length === 0 ? (
            <div className="p-12 text-center">

              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />

              <h3 className="text-xl mb-2 text-[#1E3A8A]">
                No conversations found
              </h3>

              <p className="text-gray-600">
                {searchQuery
                  ? "Try a different search term"
                  : `Start chatting with your ${
                      userRole === "teacher"
                        ? "students"
                        : "teachers"
                    }`}
              </p>

            </div>

          ) : (
            filteredChats.map((chat) => (
              <ConversationCard
                key={chat.id}
                conversation={chat}
                userRole={userRole}
                onClick={() =>
                  navigate(`/chat/${chat.otherUserId}`, {
                    state: { chat },
                  })
                }
              />
            ))
          )}

        </Card>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">

          {/* CALENDAR */}
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/calendar")}
          >
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-medium text-[#1E3A8A]">
                  View Calendar
                </h3>
                <p className="text-sm text-gray-600">
                  Check your schedule
                </p>
              </div>

            </div>
          </Card>

          {/* SESSION */}
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() =>
              navigate(
                userRole === "teacher"
                  ? "/session-requests"
                  : "/request-session"
              )
            }
          >
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>

              <div>
                <h3 className="font-medium text-[#1E3A8A]">
                  {userRole === "teacher"
                    ? "Session Requests"
                    : "Book Session"}
                </h3>

                <p className="text-sm text-gray-600">
                  {userRole === "teacher"
                    ? "Manage pending requests"
                    : "Schedule a new session"}
                </p>

              </div>

            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}