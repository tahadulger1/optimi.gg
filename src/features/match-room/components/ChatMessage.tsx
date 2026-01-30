import { type ChatMessage as ChatMessageType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/security";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Zaman damgasını formatlar (HH:MM)
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Kullanıcı adının baş harflerini alır
 */
function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, content, timestamp, isSystemMessage } = message;

  // Güvenlik: Kullanıcı girdilerini sanitize et
  const safeContent = sanitizeInput(content, 2000);
  const safeUsername = sanitizeInput(sender.username, 50);

  // Sistem mesajı
  if (isSystemMessage) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{safeContent}</span>
          <span className="text-xs text-muted-foreground/60">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Kullanıcı mesajı
  return (
    <div className="group flex items-start gap-3 px-4 py-2 transition-colors hover:bg-muted/30">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={sender.avatarUrl ?? undefined} alt={safeUsername} />
        <AvatarFallback className="bg-secondary text-xs">
          {sender.avatarUrl ? getInitials(safeUsername) : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-foreground">{safeUsername}</span>
          <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {formatTime(timestamp)}
          </span>
        </div>
        <p className="mt-0.5 break-words text-sm text-foreground/90">{safeContent}</p>
      </div>
    </div>
  );
}

/**
 * Boş chat durumu
 */
export function EmptyChatMessage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-4">
        <Bot className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-medium text-foreground">Henüz mesaj yok</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Rakip takımla iletişim kurmak için mesaj gönderin.
      </p>
    </div>
  );
}
