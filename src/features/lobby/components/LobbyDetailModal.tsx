"use client";

import { type Lobby, GAME_TYPE, LOBBY_STATUS } from "@/types";
import {
  GAME_TYPE_LABELS,
  USER_RANK_LABELS,
  LOBBY_STATUS_LABELS,
} from "@/constants/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  MapPin,
  Crown,
  User,
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

interface LobbyDetailModalProps {
  lobby: Lobby | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin?: (lobbyId: string) => void;
}

/**
 * Tarihi formatlar
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Kullanıcı adının baş harflerini alır
 */
function getInitials(username: string): string {
  return username
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function LobbyDetailModal({
  lobby,
  isOpen,
  onClose,
  onJoin,
}: LobbyDetailModalProps) {
  if (!lobby) return null;

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
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/50",
                gameColor
              )}
            >
              <GameIcon className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl">{safeTitle}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>{GAME_TYPE_LABELS[lobby.gameType]}</span>
                <span className="text-muted-foreground">•</span>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", statusLabel.className)}
                >
                  {statusLabel.text}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-2" />

        {/* Lobi Bilgileri */}
        <div className="space-y-4">
          {/* Açıklama */}
          {safeDescription && (
            <p className="text-sm text-muted-foreground">{safeDescription}</p>
          )}

          {/* Detay bilgileri */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Oyuncu Kapasitesi */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <Users
                className={cn(
                  "h-4 w-4",
                  isFull ? "text-orange-400" : "text-emerald-400"
                )}
              />
              <span className="text-muted-foreground">Kapasite:</span>
              <span className="font-medium ml-auto">
                {lobby.currentPlayers}/{lobby.maxPlayers}
              </span>
            </div>

            {/* Bölge */}
            {lobby.region && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Bölge:</span>
                <span className="font-medium ml-auto">{lobby.region}</span>
              </div>
            )}

            {/* Minimum Rütbe */}
            {rankLabel && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">Min Rütbe:</span>
                <Badge
                  variant="outline"
                  className={cn("ml-auto text-xs", rankLabel.className)}
                >
                  {rankLabel.text}
                </Badge>
              </div>
            )}

            {/* Şifre Durumu */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <Lock
                className={cn(
                  "h-4 w-4",
                  lobby.isPasswordProtected ? "text-amber-500" : "text-muted-foreground"
                )}
              />
              <span className="text-muted-foreground">Şifre:</span>
              <span className="font-medium ml-auto">
                {lobby.isPasswordProtected ? "Var" : "Yok"}
              </span>
            </div>

            {/* Oluşturulma Tarihi */}
            <div className="col-span-2 flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Oluşturulma:</span>
              <span className="font-medium ml-auto">
                {formatDate(lobby.createdAt)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Oyuncu Listesi */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Lobideki Oyuncular ({lobby.currentPlayers}/{lobby.maxPlayers})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lobby.players.map((player) => {
                const isCreator = player.id === lobby.creator.id;
                const playerRankLabel = USER_RANK_LABELS[player.rank];
                // Güvenlik: Kullanıcı adını sanitize et
                const safeUsername = sanitizeInput(player.username, 50);

                return (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      isCreator ? "bg-primary/10 border border-primary/20" : "bg-secondary/30"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs bg-secondary">
                        {getInitials(safeUsername)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {safeUsername}
                        </span>
                        {isCreator && (
                          <Crown className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn("text-xs shrink-0", playerRankLabel.className)}
                    >
                      {playerRankLabel.text}
                    </Badge>
                  </div>
                );
              })}

              {/* Boş Slotlar */}
              {Array.from({ length: lobby.availableSlots }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20 border border-dashed border-border/50"
                >
                  <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Boş Slot</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
          <Button
            variant={isJoinDisabled ? "secondary" : "gold"}
            disabled={isJoinDisabled}
            onClick={handleJoinClick}
          >
            {isFull
              ? "Lobi Dolu"
              : lobby.status === LOBBY_STATUS.IN_GAME
              ? "Oyunda"
              : "Lobiye Katıl"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
