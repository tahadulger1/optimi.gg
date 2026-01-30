"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Trophy, 
  Users, 
  Swords, 
  Star,
  ChevronRight,
  Gift,
} from "lucide-react";
import type { UserProfile } from "@/types";
import {
  RankBadge,
  RankCard,
  RankProgressFull,
  RankActivityFeed,
  RANK_TIER,
  RANK_CONFIGS,
  RANK_ACTIVITY,
  XP_REWARD_RULES,
  getRankConfig,
  getNextRank,
  calculateProgressPercentage,
  type RankTier,
  type UserRankData,
  type RankActivityLog,
} from "@/features/rank";

interface RankTabProps {
  user: UserProfile;
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
    grandmaster: RANK_TIER.MASTER,
  };
  return rankMap[userRank] || RANK_TIER.BRONZE;
}

// Mock aktivite verisi
function generateMockActivities(): RankActivityLog[] {
  return [
    {
      id: '1',
      activity: RANK_ACTIVITY.WIN_MATCH,
      xpGained: 50,
      description: 'Maç kazanma',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      activity: RANK_ACTIVITY.JOIN_TOURNAMENT,
      xpGained: 50,
      description: 'Turnuvaya katılma',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      activity: RANK_ACTIVITY.CREATE_LOBBY,
      xpGained: 25,
      description: 'Lobi oluşturma',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: '4',
      activity: RANK_ACTIVITY.COMPLETE_MATCH,
      xpGained: 30,
      description: 'Maç tamamlama',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: '5',
      activity: RANK_ACTIVITY.JOIN_LOBBY,
      xpGained: 15,
      description: 'Lobiye katılma',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '6',
      activity: RANK_ACTIVITY.WIN_STREAK,
      xpGained: 25,
      description: 'Galibiyet serisi bonusu',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];
}

export function RankTab({ user }: RankTabProps) {
  const rankTier = convertUserRankToRankTier(user.rank);
  const config = getRankConfig(rankTier);
  const nextTier = getNextRank(rankTier);
  const nextConfig = nextTier ? RANK_CONFIGS[nextTier] : null;
  
  // Mock XP değeri (gerçek API'den gelecek)
  const totalXp = config.minXp + Math.floor((config.maxXp - config.minXp) * 0.4);
  const progressPercentage = calculateProgressPercentage(totalXp, rankTier);
  const xpToNextTier = nextConfig ? nextConfig.minXp - totalXp : 0;
  const currentTierXp = totalXp - config.minXp;
  const isMaxRank = rankTier === RANK_TIER.MASTER;

  const mockRankData: UserRankData = {
    userId: user.id,
    currentTier: rankTier,
    totalXp,
    currentTierXp,
    xpToNextTier,
    progressPercentage,
    activityHistory: generateMockActivities(),
    updatedAt: new Date().toISOString(),
  };

  const tiers = Object.values(RANK_TIER) as RankTier[];

  return (
    <div className="space-y-6">
      {/* Rütbe Kartı */}
      <RankCard rankData={mockRankData} showPerks />

      {/* Rütbe Yolculuğu */}
      <Card className="bg-optimi-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Rütbe Yolculuğun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RankProgressFull 
            currentTier={rankTier}
            totalXp={totalXp}
          />
          <div className="flex justify-between mt-4 text-[10px] sm:text-xs text-muted-foreground">
            {tiers.map((tier) => (
              <span key={tier} className={`rank-text-${tier}`}>
                {RANK_CONFIGS[tier].tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Kazanım Yolları */}
        <Card className="bg-optimi-surface border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              XP Kazanma Yolları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(XP_REWARD_RULES).slice(0, 6).map(([key, rule]) => (
              <div 
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {rule.activity === RANK_ACTIVITY.CREATE_LOBBY && <Users className="w-4 h-4 text-blue-400" />}
                  {rule.activity === RANK_ACTIVITY.JOIN_LOBBY && <Users className="w-4 h-4 text-cyan-400" />}
                  {rule.activity === RANK_ACTIVITY.JOIN_TOURNAMENT && <Trophy className="w-4 h-4 text-purple-400" />}
                  {rule.activity === RANK_ACTIVITY.WIN_MATCH && <Swords className="w-4 h-4 text-green-400" />}
                  {rule.activity === RANK_ACTIVITY.COMPLETE_MATCH && <Swords className="w-4 h-4 text-cyan-400" />}
                  {rule.activity === RANK_ACTIVITY.FIRST_BLOOD && <Star className="w-4 h-4 text-yellow-400" />}
                  <div>
                    <p className="text-sm font-medium">{rule.description}</p>
                    {rule.dailyLimit && (
                      <p className="text-xs text-muted-foreground">
                        Günlük limit: {rule.dailyLimit}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-bold text-green-400">+{rule.baseXp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Aktivite Geçmişi */}
        <RankActivityFeed 
          activities={mockRankData.activityHistory}
          maxItems={6}
          className="bg-optimi-surface border-border/50"
        />
      </div>

      {/* Mevcut Rütbe Ayrıcalıkları */}
      <Card className={`bg-optimi-surface border rank-border-${rankTier}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className={`w-5 h-5 rank-text-${rankTier}`} />
            {config.name} Ayrıcalıkların
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.perks.map((perk, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30"
              >
                <div className={`w-2 h-2 rounded-full rank-badge-${rankTier}`} />
                <span className="text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sonraki Rütbe Hedefi */}
      {!isMaxRank && nextTier && nextConfig && (
        <Card className="bg-optimi-surface border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RankBadge tier={rankTier} size="md" />
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  <RankBadge tier={nextTier} size="md" showGlow />
                </div>
                <div>
                  <p className="font-semibold">
                    <span className={`rank-text-${nextTier}`}>{nextConfig.name}</span> olmak için
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {xpToNextTier.toLocaleString('tr-TR')} XP daha kazanmalısın
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{progressPercentage}%</p>
                <p className="text-xs text-muted-foreground">tamamlandı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
