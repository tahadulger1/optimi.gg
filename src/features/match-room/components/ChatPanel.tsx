"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageSquare } from "lucide-react";
import { type ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage, EmptyChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  matchId: string;
  disabled?: boolean;
}

export function ChatPanel({
  messages,
  onSendMessage,
  matchId,
  disabled = false,
}: ChatPanelProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Virtualization - 1000+ mesaj bile 60fps'de çalışır
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 60, // Tahmini mesaj yüksekliği
    overscan: 5, // Görünür alanın dışında 5 mesaj daha render et
  });

  // Yeni mesaj geldiğinde otomatik kaydır
  useEffect(() => {
    if (isAutoScroll && messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, isAutoScroll, virtualizer]);

  // Scroll durumunu kontrol et
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setIsAutoScroll(isAtBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    setIsAutoScroll(true);
    virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
  }, [messages.length, virtualizer]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Maç Sohbeti</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {messages.length} mesaj
        </span>
      </div>

      {/* Messages Container - Virtualized */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 overflow-y-auto",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted"
        )}
      >
        {messages.length === 0 ? (
          <EmptyChatMessage />
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const message = messages[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <ChatMessage message={message} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-scroll indicator */}
      {!isAutoScroll && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="mx-4 mb-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
        >
          ↓ Yeni mesajlara git
        </button>
      )}

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
}
