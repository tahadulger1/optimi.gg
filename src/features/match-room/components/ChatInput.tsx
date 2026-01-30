"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Mesajınızı yazın...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage("");
  }, [message, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter tuşuna basıldığında (Shift olmadan) mesaj gönder
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isMessageEmpty = message.trim().length === 0;

  return (
    <div className="border-t border-border bg-background p-3 sm:p-4">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[44px] max-h-[120px] resize-none bg-muted/50 text-sm sm:text-base",
            "focus-visible:ring-1 focus-visible:ring-primary"
          )}
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || isMessageEmpty}
          size="icon"
          className="min-h-[44px] min-w-[44px] h-11 w-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Gönder</span>
        </Button>
      </div>
      <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
        Enter ile gönder • Shift+Enter ile yeni satır
      </p>
    </div>
  );
}
