// Rank Servisi
// Back-end API'leri ile iletişim için

import { apiClient } from '@/lib/api-client';
import {
  type RankTier,
  type UserRankData,
  type RankActivityLog,
  type RankActivity,
  type RankStats,
  RANK_ACTIVITY,
} from '../types';
import {
  calculateRankFromXp,
  calculateProgressPercentage,
  getRankConfig,
  getNextRank,
  RANK_CONFIGS,
  XP_REWARD_RULES,
} from '../constants';

// API endpoint'leri
const RANK_API = {
  USER_RANK: (userId: string) => `/users/${userId}/rank`,
  ACTIVITY_HISTORY: (userId: string) => `/users/${userId}/rank/activity`,
  ADD_XP: (userId: string) => `/users/${userId}/rank/xp`,
  LEADERBOARD: '/rank/leaderboard',
  STATS: '/rank/stats',
};

/**
 * Mock veri üretici (API hazır olana kadar kullanılır)
 */
function generateMockRankData(userId: string): UserRankData {
  // Kullanıcı ID'sine göre deterministik XP üret
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const totalXp = Math.abs(hash % 25000);
  const currentTier = calculateRankFromXp(totalXp);
  const config = getRankConfig(currentTier);
  const currentTierXp = totalXp - config.minXp;
  const nextTier = getNextRank(currentTier);
  const xpToNextTier = nextTier ? RANK_CONFIGS[nextTier].minXp - totalXp : 0;
  const progressPercentage = calculateProgressPercentage(totalXp, currentTier);

  return {
    userId,
    currentTier,
    totalXp,
    currentTierXp,
    xpToNextTier,
    progressPercentage,
    activityHistory: generateMockActivityHistory(userId),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Mock aktivite geçmişi üret
 */
function generateMockActivityHistory(userId: string): RankActivityLog[] {
  const activities: RankActivityLog[] = [];
  const now = Date.now();
  
  const activityTypes = Object.values(RANK_ACTIVITY);
  
  for (let i = 0; i < 15; i++) {
    const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const rule = XP_REWARD_RULES[activity];
    
    activities.push({
      id: `${userId}-activity-${i}`,
      activity,
      xpGained: rule?.baseXp ?? 10,
      description: rule?.description ?? 'XP kazanıldı',
      timestamp: new Date(now - i * 3600000 * Math.random() * 24).toISOString(),
    });
  }
  
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Mock liderlik tablosu üret
 */
function generateMockLeaderboard(limit: number) {
  const usernames = [
    'ProGamer42', 'NightHawk', 'ShadowBlade', 'FireStorm', 
    'IcePhoenix', 'ThunderBolt', 'CyberWolf', 'DarkKnight',
    'SteelDragon', 'BlazeMaster', 'VortexX', 'QuantumZ'
  ];
  
  return Array.from({ length: limit }, (_, i) => ({
    userId: `user-${i}`,
    username: usernames[i] || `Player${i + 1}`,
    totalXp: 25000 - (i * 2000) + Math.floor(Math.random() * 500),
    tier: calculateRankFromXp(25000 - (i * 2000)),
  }));
}

/**
 * Rank Servisi
 * API entegrasyonu için hazır, şimdilik mock data döndürür
 */
export const rankService = {
  /**
   * Kullanıcının rütbe verisini al
   */
  async getUserRank(userId: string): Promise<UserRankData> {
    try {
      // TODO: API hazır olduğunda aktif et
      // const response = await apiClient.get<UserRankData>(RANK_API.USER_RANK(userId));
      // return response.data;
      
      // Mock data döndür
      await new Promise(resolve => setTimeout(resolve, 300)); // Simüle gecikme
      return generateMockRankData(userId);
    } catch (error) {
      console.error('[RankService] getUserRank error:', error);
      throw error;
    }
  },

  /**
   * Kullanıcının aktivite geçmişini al
   */
  async getActivityHistory(userId: string, limit = 20): Promise<RankActivityLog[]> {
    try {
      // TODO: API hazır olduğunda aktif et
      // const response = await apiClient.get<RankActivityLog[]>(
      //   RANK_API.ACTIVITY_HISTORY(userId),
      //   { params: { limit } }
      // );
      // return response.data;
      
      // Mock data döndür
      await new Promise(resolve => setTimeout(resolve, 200));
      return generateMockActivityHistory(userId).slice(0, limit);
    } catch (error) {
      console.error('[RankService] getActivityHistory error:', error);
      throw error;
    }
  },

  /**
   * Kullanıcıya XP ekle
   */
  async addXp(
    userId: string,
    activity: RankActivity,
    referenceId?: string,
    referenceType?: 'lobby' | 'tournament' | 'match'
  ): Promise<{ xpGained: number; newTotal: number; tierChanged: boolean; newTier?: RankTier }> {
    try {
      // TODO: API hazır olduğunda aktif et
      // const response = await apiClient.post(RANK_API.ADD_XP(userId), {
      //   activity,
      //   referenceId,
      //   referenceType,
      // });
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const rule = XP_REWARD_RULES[activity];
      const xpGained = rule?.baseXp ?? 10;
      
      // Simüle: Mevcut XP'yi al ve güncelle
      const currentData = await rankService.getUserRank(userId);
      const newTotal = currentData.totalXp + xpGained;
      const newTier = calculateRankFromXp(newTotal);
      const tierChanged = newTier !== currentData.currentTier;
      
      return {
        xpGained,
        newTotal,
        tierChanged,
        newTier: tierChanged ? newTier : undefined,
      };
    } catch (error) {
      console.error('[RankService] addXp error:', error);
      throw error;
    }
  },

  /**
   * Liderlik tablosunu al
   */
  async getLeaderboard(limit = 10): Promise<{
    userId: string;
    username: string;
    totalXp: number;
    tier: RankTier;
  }[]> {
    try {
      // TODO: API hazır olduğunda aktif et
      // const response = await apiClient.get(RANK_API.LEADERBOARD, { params: { limit } });
      // return response.data;
      
      // Mock data döndür
      await new Promise(resolve => setTimeout(resolve, 300));
      return generateMockLeaderboard(limit);
    } catch (error) {
      console.error('[RankService] getLeaderboard error:', error);
      throw error;
    }
  },

  /**
   * Genel rütbe istatistiklerini al
   */
  async getStats(): Promise<RankStats> {
    try {
      // TODO: API hazır olduğunda aktif et
      // const response = await apiClient.get<RankStats>(RANK_API.STATS);
      // return response.data;
      
      // Mock data döndür
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tiers = Object.values(RANK_CONFIGS);
      const totalUsersPerTier: Record<RankTier, number> = {} as Record<RankTier, number>;
      
      tiers.forEach(config => {
        // Simüle kullanıcı dağılımı (piramit şeklinde)
        const tierIndex = tiers.findIndex(t => t.tier === config.tier);
        totalUsersPerTier[config.tier] = Math.floor(10000 / Math.pow(2, tierIndex));
      });
      
      return {
        totalUsersPerTier,
        topUsers: generateMockLeaderboard(5),
        last24hXpGained: Math.floor(Math.random() * 500000) + 100000,
      };
    } catch (error) {
      console.error('[RankService] getStats error:', error);
      throw error;
    }
  },

  /**
   * Aktivite için XP hesapla (kuralları uygula)
   */
  calculateXpForActivity(activity: RankActivity): number {
    const rule = XP_REWARD_RULES[activity];
    return rule?.baseXp ?? 0;
  },

  /**
   * Günlük limit kontrolü (istemci tarafı)
   */
  async checkDailyLimit(userId: string, activity: RankActivity): Promise<{
    canEarn: boolean;
    remaining: number;
    limit: number;
  }> {
    const rule = XP_REWARD_RULES[activity];
    
    if (!rule?.dailyLimit) {
      return { canEarn: true, remaining: Infinity, limit: Infinity };
    }

    // TODO: API'den günlük aktivite sayısını al
    // Şimdilik her zaman izin ver
    return {
      canEarn: true,
      remaining: rule.dailyLimit,
      limit: rule.dailyLimit,
    };
  },
};

export default rankService;
