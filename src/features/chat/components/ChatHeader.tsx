import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface ChatHeaderProps {
  name: string;
  subtitle?: string;
  avatar?: string;
}

export default function ChatHeader({
  name,
  subtitle,
  avatar = "U",
}: ChatHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl mb-2 text-[#1E3A8A]">Messages</h1>

      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-[#8B5CF6] text-white">
            {avatar}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="text-[#1E3A8A]">{name}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
