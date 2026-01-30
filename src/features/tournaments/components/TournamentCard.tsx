"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Globe, Trophy, Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TournamentCard as TournamentCardType,
  TOURNAMENT_STATUS,
  TOURNAMENT_TYPE,
  GAME_TYPE,
} from "../types";
import { GAME_TYPE_LABELS, formatPrize } from "@/constants/mockData";

interface TournamentCardProps {
  tournament: TournamentCardType;
  className?: string;
}

// Durum badge renkleri
const statusStyles: Record<string, { label: string; className: string }> = {
  [TOURNAMENT_STATUS.UPCOMING]: {
    label: "Yakında",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  [TOURNAMENT_STATUS.REGISTRATION_OPEN]: {
    label: "Kayıt Açık",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  [TOURNAMENT_STATUS.REGISTRATION_CLOSED]: {
    label: "Kayıt Kapandı",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  [TOURNAMENT_STATUS.IN_PROGRESS]: {
    label: "Devam Ediyor",
    className: "bg-primary/20 text-primary border-primary/30 animate-pulse",
  },
  [TOURNAMENT_STATUS.COMPLETED]: {
    label: "Tamamlandı",
    className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  },
  [TOURNAMENT_STATUS.CANCELLED]: {
    label: "İptal Edildi",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

// Tip badge renkleri
const typeStyles: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  [TOURNAMENT_TYPE.ONLINE]: {
    label: "Online",
    icon: <Globe className="h-3 w-3" />,
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  [TOURNAMENT_TYPE.OFFLINE]: {
    label: "Offline",
    icon: <MapPin className="h-3 w-3" />,
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
};

// Tarih formatlama
function formatTournamentDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("tr-TR", options);
}

export function TournamentCard({ tournament, className }: TournamentCardProps) {
  const statusStyle = statusStyles[tournament.status] || statusStyles.upcoming;
  const typeStyle = typeStyles[tournament.type] || typeStyles.online;
  const gameName = GAME_TYPE_LABELS[tournament.gameType] || tournament.gameType;

  return (
    <Link href={`/turnuvalar/${tournament.id}`} className="block group">
      <Card
        className={cn(
          "overflow-hidden bg-optimi-surface border-border/50 card-hover cursor-pointer",
          className
        )}
      >
        {/* Görsel */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={tournament.imageUrl}
            alt={tournament.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Üst Badge'ler */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {/* Durum Badge */}
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide border",
                statusStyle.className
              )}
            >
              {statusStyle.label}
            </Badge>

            {/* Tip Badge */}
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium flex items-center gap-1 border",
                typeStyle.className
              )}
            >
              {typeStyle.icon}
              {typeStyle.label}
            </Badge>
          </div>

          {/* Ödül Havuzu */}
          <div className="absolute top-3 right-3">
            <div className="px-3 py-1.5 rounded-lg bg-primary/90 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  {formatPrize(tournament.prizePool.total, tournament.prizePool.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Alt Bilgiler (Görsel üzerinde) */}
          <div className="absolute bottom-3 left-3 right-3">
            {/* Oyun Tag */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium bg-white/10 backdrop-blur-sm text-white rounded mb-2">
              <Gamepad2 className="h-3 w-3" />
              {gameName}
            </span>

            {/* Başlık */}
            <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-primary transition-colors">
              {tournament.title}
            </h3>
          </div>
        </div>

        {/* Kart Alt Bilgileri */}
        <div className="p-4 space-y-3">
          {/* Tarih ve Lokasyon */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary/70" />
              <span>{formatTournamentDate(tournament.startDate)}</span>
            </div>

            {tournament.type === TOURNAMENT_TYPE.OFFLINE && tournament.location?.city && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 text-emerald-400/70" />
                <span>{tournament.location.city}</span>
              </div>
            )}
          </div>

          {/* Katılımcı Sayısı */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary/70" />
              <span>
                {tournament.currentParticipants} / {tournament.maxParticipants} Takım
              </span>
            </div>

            {/* Doluluk Çubuğu */}
            <div className="w-20 h-1.5 bg-border/50 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  tournament.currentParticipants >= tournament.maxParticipants
                    ? "bg-red-500"
                    : "bg-primary"
                )}
                style={{
                  width: `${Math.min(
                    (tournament.currentParticipants / tournament.maxParticipants) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
