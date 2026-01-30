"use client";

import { memo } from "react";
import { type Lobby, GAME_TYPE, LOBBY_STATUS } from "@/types";
import {
  GAME_TYPE_LABELS,
  USER_RANK_LABELS,
  LOBBY_STATUS_LABELS,
} from "@/constants/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Lock,
  Gamepad2,
  Swords,
  Target,
  Trophy,
  Crosshair,
  Car,
  Ghost,
  Bomb,
  Footprints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/security";

// Oyun ikonları
const GAME_ICONS: Record<string, React.ElementType> = {
  [GAME_TYPE.VALORANT]: Crosshair,
  [GAME_TYPE.LOL]: Swords,
  [GAME_TYPE.TFT]: Trophy,
  [GAME_TYPE.WILD_RIFT]: Target,
  [GAME_TYPE.PUBG_MOBILE]: Bomb,
  [GAME_TYPE.WARROCK]: Target,
  [GAME_TYPE.HAXBALL]: Footprints,
  [GAME_TYPE.ROCKET_LEAGUE]: Car,
  [GAME_TYPE.FALL_GUYS]: Ghost,
};

// Oyun renkleri
const GAME_COLORS: Record<string, string> = {
  [GAME_TYPE.VALORANT]: "text-red-500",
  [GAME_TYPE.LOL]: "text-yellow-500",
  [GAME_TYPE.TFT]: "text-purple-500",
  [GAME_TYPE.WILD_RIFT]: "text-blue-500",
  [GAME_TYPE.PUBG_MOBILE]: "text-orange-500",
  [GAME_TYPE.WARROCK]: "text-green-500",
  [GAME_TYPE.HAXBALL]: "text-lime-500",
  [GAME_TYPE.ROCKET_LEAGUE]: "text-blue-400",
  [GAME_TYPE.FALL_GUYS]: "text-pink-500",
};

interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (lobbyId: string) => void;
  onViewDetails?: (lobby: Lobby) => void;
}

function LobbyCardComponent({ lobby, onJoin, onViewDetails }: LobbyCardProps) {
  const GameIcon = GAME_ICONS[lobby.gameType] || Gamepad2;
  const gameColor = GAME_COLORS[lobby.gameType] || "text-white";
  const isFull = lobby.availableSlots === 0;
  const isJoinDisabled = isFull || lobby.status !== LOBBY_STATUS.WAITING;
  const statusLabel = LOBBY_STATUS_LABELS[lobby.status];
  const rankLabel = lobby.minRankRequired
    ? USER_RANK_LABELS[lobby.minRankRequired]
    : null;

  // Güvenlik: Kullanıcı girdilerini sanitize et (XSS koruması)
  const safeTitle = sanitizeInput(lobby.title, 100);
  const safeDescription = lobby.description ? sanitizeInput(lobby.description, 500) : null;

  const handleJoinClick = () => {
    if (!isJoinDisabled && onJoin) {
      onJoin(lobby.id);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(lobby);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Üst gradient dekorasyon */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          isFull ? "from-orange-500 to-red-500" : "from-emerald-500 to-primary"
        )}
      />

      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Oyun ikonu ve başlık */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={cn(
                "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50",
                gameColor
              )}
            >
              <GameIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                {safeTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {GAME_TYPE_LABELS[lobby.gameType]}
              </p>
            </div>
          </div>

          {/* Durum badge'i */}
          <Badge
            variant="secondary"
            className={cn("shrink-0 text-[10px] sm:text-xs", statusLabel.className)}
          >
            {statusLabel.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 sm:pb-3">
        {/* Açıklama */}
        {safeDescription && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
            {safeDescription}
          </p>
        )}

        {/* Bilgi satırları */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Oyuncu sayısı */}
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 rounded-md bg-secondary/50 px-2 py-1 min-h-[28px] sm:min-h-[32px]",
              isFull ? "text-orange-400" : "text-emerald-400"
            )}
          >
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-xs sm:text-sm font-medium">
              {lobby.currentPlayers}/{lobby.maxPlayers}
            </span>
          </div>

          {/* Minimum rütbe */}
          {rankLabel && (
            <Badge
              variant="outline"
              className={cn("text-[10px] sm:text-xs min-h-[28px] sm:min-h-[32px] flex items-center", rankLabel.className)}
            >
              {rankLabel.text}+
            </Badge>
          )}

          {/* Şifre korumalı */}
          {lobby.isPasswordProtected && (
            <div className="flex items-center justify-center min-w-[28px] min-h-[28px] sm:min-w-[32px] sm:min-h-[32px] rounded-md bg-secondary/50 text-amber-500">
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </div>
          )}

          {/* Bölge */}
          {lobby.region && (
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md min-h-[28px] sm:min-h-[32px] flex items-center">
              {lobby.region}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3 sm:pb-4">
        <Button
          variant={isJoinDisabled ? "secondary" : "gold"}
          size="default"
          className="w-full min-h-[44px]"
          disabled={isJoinDisabled}
          onClick={(e) => {
            e.stopPropagation();
            handleJoinClick();
          }}
        >
          {isFull ? "Dolu" : lobby.status === LOBBY_STATUS.IN_GAME ? "Oyunda" : "Katıl"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// React.memo ile gereksiz re-render'ları önle
export const LobbyCard = memo(LobbyCardComponent);
