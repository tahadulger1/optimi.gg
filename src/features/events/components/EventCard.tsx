"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Globe, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EventCard as EventCardType,
  EVENT_STATUS,
  EVENT_TYPE,
  EVENT_CATEGORY,
} from "../types";

interface EventCardProps {
  event: EventCardType;
  className?: string;
}

// Durum badge renkleri
const statusStyles: Record<string, { label: string; className: string }> = {
  [EVENT_STATUS.UPCOMING]: {
    label: "Yaklaşıyor",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  [EVENT_STATUS.REGISTRATION_OPEN]: {
    label: "Kayıt Açık",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  [EVENT_STATUS.REGISTRATION_CLOSED]: {
    label: "Kayıt Kapandı",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  [EVENT_STATUS.LIVE]: {
    label: "Canlı",
    className: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
  },
  [EVENT_STATUS.COMPLETED]: {
    label: "Tamamlandı",
    className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  },
  [EVENT_STATUS.CANCELLED]: {
    label: "İptal Edildi",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

// Tip badge renkleri
const typeStyles: Record<string, { label: string; icon: React.ReactNode }> = {
  [EVENT_TYPE.ONLINE]: {
    label: "Online",
    icon: <Globe className="h-3 w-3" />,
  },
  [EVENT_TYPE.OFFLINE]: {
    label: "Yüz yüze",
    icon: <Building2 className="h-3 w-3" />,
  },
  [EVENT_TYPE.HYBRID]: {
    label: "Hibrit",
    icon: <Globe className="h-3 w-3" />,
  },
};

// Kategori etiketleri
const categoryLabels: Record<string, string> = {
  [EVENT_CATEGORY.MEETUP]: "Buluşma",
  [EVENT_CATEGORY.WORKSHOP]: "Workshop",
  [EVENT_CATEGORY.PANEL]: "Panel",
  [EVENT_CATEGORY.WEBINAR]: "Webinar",
  [EVENT_CATEGORY.CONFERENCE]: "Konferans",
  [EVENT_CATEGORY.NETWORKING]: "Networking",
  [EVENT_CATEGORY.COMMUNITY]: "Topluluk",
  [EVENT_CATEGORY.UNIVERSITY]: "Üniversite",
};

// Tarih formatlama
function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("tr-TR", options);
}

export function EventCard({ event, className }: EventCardProps) {
  const statusStyle = statusStyles[event.status] || statusStyles.upcoming;
  const typeStyle = typeStyles[event.type] || typeStyles.online;

  return (
    <Link href={`/etkinlikler/${event.id}`} className="block group">
      <Card
        className={cn(
          "overflow-hidden bg-optimi-surface border-border/50 card-hover cursor-pointer",
          className
        )}
      >
        {/* Görsel */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
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
              className="text-[10px] font-medium bg-black/40 text-white/90 border-white/20 flex items-center gap-1"
            >
              {typeStyle.icon}
              {typeStyle.label}
            </Badge>
          </div>

          {/* Organizatör Logo */}
          {event.organizer.logoUrl && (
            <div className="absolute top-3 right-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                <Image
                  src={event.organizer.logoUrl}
                  alt={event.organizer.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Alt Bilgiler (Görsel üzerinde) */}
          <div className="absolute bottom-3 left-3 right-3">
            {/* Kategori Tag */}
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded mb-2">
              {categoryLabels[event.category] || event.category}
            </span>

            {/* Başlık */}
            <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Kart Alt Bilgileri */}
        <div className="p-4 space-y-3">
          {/* Organizatör */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary/70" />
            <span className="truncate">{event.organizer.name}</span>
          </div>

          {/* Tarih ve Lokasyon */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary/70" />
              <span>{formatEventDate(event.startDate)}</span>
            </div>

            {!event.location.isOnline && event.location.city && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{event.location.city}</span>
              </div>
            )}
          </div>

          {/* Katılımcı Sayısı */}
          {event.maxParticipants && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary/70" />
                <span>
                  {event.currentParticipants} / {event.maxParticipants} Katılımcı
                </span>
              </div>

              {/* Doluluk Çubuğu */}
              <div className="w-20 h-1.5 bg-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (event.currentParticipants / event.maxParticipants) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-muted/50 text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
