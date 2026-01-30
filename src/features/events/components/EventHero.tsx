"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Calendar, MapPin, Globe, Users, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

// Hero varyantları
export type EventHeroVariant = "all" | "online" | "offline";

interface EventHeroConfig {
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  titleGradient: string;
  description: string;
  imageUrl: string;
  stats: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    value: string;
    label: string;
  }[];
}

const heroConfigs: Record<EventHeroVariant, EventHeroConfig> = {
  all: {
    badge: "Topluluk Etkinlikleri",
    badgeIcon: Sparkles,
    title: "Etkinlikler",
    titleGradient: "text-gradient-gold",
    description:
      "Espor topluluğunun buluşma noktası! Panel konuşmaları, workshop'lar, meetup'lar ve daha fazlasını keşfedin. Online veya yüz yüze katılın!",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070",
    stats: [
      {
        icon: Calendar,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        value: "50+",
        label: "Aktif Etkinlik",
      },
      {
        icon: Users,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "5.000+",
        label: "Katılımcı",
      },
      {
        icon: Mic,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        value: "100+",
        label: "Konuşmacı",
      },
    ],
  },
  online: {
    badge: "Online Etkinlikler",
    badgeIcon: Globe,
    title: "Online Etkinlikler",
    titleGradient: "text-gradient-blue",
    description:
      "Her yerden katılabileceğiniz online buluşmalar, webinarlar, panel konuşmaları ve canlı yayınlar. Discord, Twitch ve Zoom üzerinden topluluğa katılın!",
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070",
    stats: [
      {
        icon: Globe,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        value: "30+",
        label: "Online Etkinlik",
      },
      {
        icon: Users,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "3.000+",
        label: "Online Katılımcı",
      },
      {
        icon: Mic,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
        value: "50+",
        label: "Canlı Yayın",
      },
    ],
  },
  offline: {
    badge: "Offline Etkinlikler",
    badgeIcon: MapPin,
    title: "Offline Etkinlikler",
    titleGradient: "text-gradient-emerald",
    description:
      "Yüz yüze buluşmalar, şehir meetup'ları, üniversite etkinlikleri ve topluluk organizasyonları. Gerçek hayatta espor ailesine katılın!",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070",
    stats: [
      {
        icon: MapPin,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "20+",
        label: "Offline Etkinlik",
      },
      {
        icon: Users,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        value: "2.000+",
        label: "Katılımcı",
      },
      {
        icon: Calendar,
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
        value: "15+",
        label: "Şehir",
      },
    ],
  },
};

interface EventHeroProps {
  variant?: EventHeroVariant;
  className?: string;
}

export function EventHero({ variant = "all", className }: EventHeroProps) {
  const config = heroConfigs[variant];
  const BadgeIcon = config.badgeIcon;

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Arka Plan Görseli */}
      <div className="absolute inset-0">
        <Image
          src={config.imageUrl}
          alt={config.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-optimi-darker/60 via-optimi-darker/80 to-optimi-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-optimi-darker/50 to-transparent" />
      </div>

      {/* İçerik */}
      <div className="relative container mx-auto px-4 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
            <BadgeIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {config.badge}
            </span>
          </div>

          {/* Başlık */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className={config.titleGradient}>{config.title}</span>
          </h1>

          {/* Açıklama */}
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed">
            {config.description}
          </p>

          {/* İstatistikler */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {config.stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.iconBg)}>
                    <StatIcon className={cn("h-6 w-6", stat.iconColor)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alt Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-optimi-darker to-transparent" />
    </section>
  );
}
