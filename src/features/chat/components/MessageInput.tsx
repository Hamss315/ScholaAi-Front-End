import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    await onSend(trimmed);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
        disabled={disabled}
      />

      <Button
        type="submit"
        className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90"
        disabled={disabled || !message.trim()}
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
