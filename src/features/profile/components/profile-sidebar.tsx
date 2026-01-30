"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Gamepad2, Target, Zap, ChevronRight } from "lucide-react";
import type { UserProfile } from "@/types";
import { sanitizeInput } from "@/lib/security";
import {
  RankBadge,
  RankProgress,
  RANK_TIER,
  getRankConfig,
  getNextRank,
  calculateRankFromXp,
  calculateProgressPercentage,
  RANK_CONFIGS,
  type RankTier,
} from "@/features/rank";

interface ProfileSidebarProps {
  user: UserProfile;
  /** Toplam XP (opsiyonel, mock değer kullanılabilir) */
  totalXp?: number;
}

// Geçici: UserRank'ı RankTier'a dönüştür
function convertUserRankToRankTier(userRank: string): RankTier {
  const rankMap: Record<string, RankTier> = {
    bronze: RANK_TIER.BRONZE,
    silver: RANK_TIER.SILVER,
    gold: RANK_TIER.GOLD,
    platinum: RANK_TIER.PLATINUM,
    diamond: RANK_TIER.DIAMOND,
    mastery: RANK_TIER.MASTERY,
    master: RANK_TIER.MASTER,
    grandmaster: RANK_TIER.MASTER, // Eski grandmaster -> yeni master
  };
  return rankMap[userRank] || RANK_TIER.BRONZE;
}

export function ProfileSidebar({ user, totalXp }: ProfileSidebarProps) {
  // Rütbe hesaplamaları
  const rankTier = convertUserRankToRankTier(user.rank);
  const config = getRankConfig(rankTier);
  const nextTier = getNextRank(rankTier);
  const nextConfig = nextTier ? RANK_CONFIGS[nextTier] : null;
  
  // Mock XP değeri (gerçek API'den gelecek)
  const userTotalXp = totalXp ?? (config.minXp + Math.floor((config.maxXp - config.minXp) * 0.4));
  const progressPercentage = calculateProgressPercentage(userTotalXp, rankTier);
  const xpToNextTier = nextConfig ? nextConfig.minXp - userTotalXp : 0;
  const isMaxRank = rankTier === RANK_TIER.MASTER;

  const winRate = user.totalMatchesPlayed > 0 
    ? Math.round((user.matchesWon / user.totalMatchesPlayed) * 100) 
    : 0;

  // Güvenlik: Kullanıcı girdilerini sanitize et (XSS koruması)
  const safeUsername = sanitizeInput(user.username, 50);
  const safeBio = user.bio ? sanitizeInput(user.bio, 500) : null;
  const safeSocialLinks = user.socialLinks ? {
    discord: user.socialLinks.discord ? sanitizeInput(user.socialLinks.discord, 50) : undefined,
    twitter: user.socialLinks.twitter ? sanitizeInput(user.socialLinks.twitter, 50) : undefined,
    twitch: user.socialLinks.twitch ? sanitizeInput(user.socialLinks.twitch, 50) : undefined,
  } : null;

  return (
    <div className="space-y-6">
      {/* Avatar ve Temel Bilgiler */}
      <Card className="bg-optimi-surface border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <Avatar className={`h-32 w-32 border-4 rank-border-${rankTier}`}>
                <AvatarImage 
                  src={user.avatarUrl || user.profileImageUrl || undefined} 
                  alt={safeUsername} 
                />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {safeUsername.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Rütbe ikonu - Avatar köşesinde */}
              <div className="absolute -bottom-1 -right-1">
                <RankBadge 
                  tier={rankTier} 
                  size="md" 
                  variant="icon-only" 
                  showGlow 
                />
              </div>
            </div>

            {/* Kullanıcı Adı */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {safeUsername}
            </h1>

            {/* Rütbe Badge */}
            <RankBadge tier={rankTier} size="lg" showGlow />
          </div>
        </CardContent>
      </Card>

      {/* Rütbe İlerleme Kartı */}
      <Card className={`bg-optimi-surface border rank-border-${rankTier}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Rütbe İlerleme
            </h3>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold">{userTotalXp.toLocaleString('tr-TR')} XP</span>
            </div>
          </div>

          {/* Mevcut Rütbe */}
          <div className="flex items-center gap-3 mb-4">
            <RankBadge tier={rankTier} size="sm" />
            <div className="flex-1">
              <p className={`font-semibold rank-text-${rankTier}`}>{config.name}</p>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          {!isMaxRank && nextConfig && (
            <div className="space-y-2">
              <RankProgress 
                tier={rankTier} 
                progress={progressPercentage} 
                showPercentage 
                size="md"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Sonraki: <span className={`font-medium rank-text-${nextTier}`}>{nextConfig.name}</span></span>
                <span>{xpToNextTier.toLocaleString('tr-TR')} XP kaldı</span>
              </div>
            </div>
          )}

          {isMaxRank && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10">
              <span className="text-xs font-medium text-yellow-500">
                En Yüksek Rütbedesin!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biyografi */}
      {safeBio && (
        <Card className="bg-optimi-surface border-border/50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Hakkında
            </h3>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {safeBio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* İstatistikler */}
      <Card className="bg-optimi-surface border-border/50">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            İstatistikler
          </h3>
          
          <div className="space-y-4">
            {/* Toplam Maç */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Gamepad2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Toplam Maç</p>
                <p className="text-lg font-bold">{user.totalMatchesPlayed}</p>
              </div>
            </div>

            {/* Kazanılan Maç */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Trophy className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kazanılan</p>
                <p className="text-lg font-bold">{user.matchesWon}</p>
              </div>
            </div>

            {/* Win Rate */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Target className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kazanma Oranı</p>
                <p className="text-lg font-bold">%{winRate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sosyal Bağlantılar */}
      {safeSocialLinks && (safeSocialLinks.discord || safeSocialLinks.twitter || safeSocialLinks.twitch) && (
        <Card className="bg-optimi-surface border-border/50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Sosyal Medya
            </h3>
            
            <div className="space-y-3">
              {safeSocialLinks.discord && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span className="text-foreground/80">{safeSocialLinks.discord}</span>
                </div>
              )}
              
              {safeSocialLinks.twitter && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-foreground/80">{safeSocialLinks.twitter}</span>
                </div>
              )}
              
              {safeSocialLinks.twitch && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                  </svg>
                  <span className="text-foreground/80">{safeSocialLinks.twitch}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
