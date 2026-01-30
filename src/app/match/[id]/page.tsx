"use client";

import { useState, useCallback, use } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { type ChatMessage as ChatMessageType } from "@/types";
import { getMatchById, getChatMessagesByMatchId } from "@/constants/mockData";
import { 
  TeamCard, 
  ScoreDisplay, 
  ChatPanel 
} from "@/features/match-room";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Z_INDEX } from "@/lib/z-index";

// MatchActions - screenshot upload içerdiği için lazy load
const MatchActions = dynamic(
  () => import("@/features/match-room/components/MatchActions").then((mod) => ({ default: mod.MatchActions })),
  {
    loading: () => (
      <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
    ssr: false,
  }
);

interface MatchRoomPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchRoomPage({ params }: MatchRoomPageProps) {
  const { id } = use(params);
  
  // Mock veriyi al
  const match = getMatchById(id);
  const initialMessages = getChatMessagesByMatchId(id);
  
  // State
  const [messages, setMessages] = useState<ChatMessageType[]>(
    initialMessages.length > 0 ? initialMessages : getChatMessagesByMatchId("match-001")
  );
  const [matchData, setMatchData] = useState(match ?? getMatchById("match-001"));

  // Maç bulunamadıysa
  if (!matchData) {
    notFound();
  }

  // Mesaj gönderme handler'ı
  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      matchId: matchData.id,
      sender: {
        id: "current-user",
        username: "Sen",
        avatarUrl: null,
        rank: "diamond",
      },
      content,
      timestamp: new Date().toISOString(),
      isSystemMessage: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [matchData.id]);

  // Sonuç bildirme handler'ı
  const handleReportResult = useCallback((winner: "teamA" | "teamB") => {
    setMatchData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        winner,
        status: "completed" as const,
        scoreA: winner === "teamA" ? prev.scoreA + 1 : prev.scoreA,
        scoreB: winner === "teamB" ? prev.scoreB + 1 : prev.scoreB,
      };
    });

    // Sistem mesajı ekle
    const systemMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      matchId: matchData.id,
      sender: {
        id: "system",
        username: "Sistem",
        avatarUrl: null,
        rank: "bronze",
      },
      content: `Maç sonucu bildirildi: ${winner === "teamA" ? matchData.teamA.name : matchData.teamB.name} kazandı!`,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, [matchData]);

  // Kanıt yükleme handler'ı
  const handleUploadEvidence = useCallback(async (file: File) => {
    // Simüle edilmiş yükleme
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Kanıt yüklendi:", file.name);
  }, []);

  // İtiraz handler'ı
  const handleDispute = useCallback(() => {
    setMatchData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: "disputed" as const,
      };
    });

    // Sistem mesajı ekle
    const systemMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      matchId: matchData.id,
      sender: {
        id: "system",
        username: "Sistem",
        avatarUrl: null,
        rank: "bronze",
      },
      content: "Maç sonucuna itiraz edildi. Hakem incelemesi bekleniyor.",
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, [matchData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="sticky top-0 border-b border-border bg-background/95 backdrop-blur"
        style={{ zIndex: Z_INDEX.sticky }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" asChild className="min-w-[44px] min-h-[44px]">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Geri</span>
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Maç Odası</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {matchData.tournamentName} - {matchData.round}
            </p>
          </div>

          {/* Mobil Chat Butonu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden min-w-[44px] min-h-[44px] relative"
              >
                <MessageSquare className="h-5 w-5" />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {messages.length > 99 ? "99+" : messages.length}
                  </span>
                )}
                <span className="sr-only">Sohbeti Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>Maç Sohbeti</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-hidden">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  matchId={matchData.id}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Sol Panel - Maç Detayları */}
          <div className="space-y-4 sm:space-y-6">
            {/* Skor Gösterimi */}
            <ScoreDisplay match={matchData} />

            {/* Takımlar - Mobilde tek sütun, tablet+ iki sütun */}
            <div className="grid gap-4 md:grid-cols-2">
              <TeamCard 
                team={matchData.teamA} 
                side="left" 
                isWinner={matchData.winner === "teamA"}
              />
              <TeamCard 
                team={matchData.teamB} 
                side="right" 
                isWinner={matchData.winner === "teamB"}
              />
            </div>

            {/* Maç Aksiyonları */}
            <MatchActions
              match={matchData}
              onReportResult={handleReportResult}
              onUploadEvidence={handleUploadEvidence}
              onDispute={handleDispute}
            />
          </div>

          {/* Sağ Panel - Chat (sadece desktop) */}
          <div className="hidden lg:block h-[calc(100vh-8rem)] lg:sticky lg:top-20">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              matchId={matchData.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
