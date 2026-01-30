"use client";

import * as React from "react";
import Image from "next/image";
import { Trophy, Globe, MapPin, Users, Calendar, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Hero varyantları
export type TournamentHeroVariant = "all" | "online" | "offline";

interface TournamentHeroConfig {
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

const heroConfigs: Record<TournamentHeroVariant, TournamentHeroConfig> = {
  all: {
    badge: "Espor Turnuvaları",
    badgeIcon: Trophy,
    title: "Turnuvalar",
    titleGradient: "text-gradient-gold",
    description:
      "Türkiye'nin en büyük espor turnuvalarına katıl! Online ve offline turnuvalarda yeteneklerini göster, ödüller kazan ve espor sahnesinde adını duyur.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    stats: [
      {
        icon: Trophy,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        value: "100+",
        label: "Aktif Turnuva",
      },
      {
        icon: Users,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "10.000+",
        label: "Katılımcı",
      },
      {
        icon: Gamepad2,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        value: "500.000₺+",
        label: "Ödül Havuzu",
      },
    ],
  },
  online: {
    badge: "Online Turnuvalar",
    badgeIcon: Globe,
    title: "Online Turnuvalar",
    titleGradient: "text-gradient-blue",
    description:
      "Evinden katılabileceğin online turnuvalar! Her yerden bağlan, rakiplerinle mücadele et ve şampiyonluğu kazan. Discord ve oyun içi lobiler aracılığıyla.",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070",
    stats: [
      {
        icon: Globe,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        value: "60+",
        label: "Online Turnuva",
      },
      {
        icon: Users,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "7.500+",
        label: "Online Oyuncu",
      },
      {
        icon: Calendar,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
        value: "Her Hafta",
        label: "Yeni Turnuva",
      },
    ],
  },
  offline: {
    badge: "Offline Turnuvalar",
    badgeIcon: MapPin,
    title: "Offline Turnuvalar",
    titleGradient: "text-gradient-emerald",
    description:
      "Sahneye çık, atmosferi hisset! LAN turnuvaları, espor arenalarında yüz yüze mücadeleler ve büyük organizasyonlar. Gerçek espor deneyimini yaşa!",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070",
    stats: [
      {
        icon: MapPin,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        value: "40+",
        label: "Offline Turnuva",
      },
      {
        icon: Users,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        value: "2.500+",
        label: "LAN Katılımcı",
      },
      {
        icon: Trophy,
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
        value: "10+",
        label: "Şehir",
      },
    ],
  },
};

interface TournamentHeroProps {
  variant?: TournamentHeroVariant;
  className?: string;
}

export function TournamentHero({ variant = "all", className }: TournamentHeroProps) {
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
