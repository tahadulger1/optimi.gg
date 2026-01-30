'use client';

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type RankTier,
  type UserRankData,
  type RankActivityLog,
  type RankActivity,
  RANK_TIER,
} from '../types';
import {
  getRankConfig,
  getNextRank,
  calculateRankFromXp,
  calculateProgressPercentage,
  RANK_CONFIGS,
  XP_REWARD_RULES,
  meetsRankRequirement,
} from '../constants';
import { rankService } from '../services';

// Query keys
export const rankQueryKeys = {
  all: ['rank'] as const,
  userRank: (userId: string) => [...rankQueryKeys.all, 'user', userId] as const,
  activityHistory: (userId: string) => [...rankQueryKeys.all, 'activity', userId] as const,
  leaderboard: () => [...rankQueryKeys.all, 'leaderboard'] as const,
};

/**
 * Kullanıcı rütbe verisi hook'u
 */
export function useUserRank(userId: string | undefined) {
  return useQuery({
    queryKey: rankQueryKeys.userRank(userId ?? ''),
    queryFn: () => rankService.getUserRank(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
}

/**
 * XP aktivite geçmişi hook'u
 */
export function useRankActivityHistory(userId: string | undefined, limit = 20) {
  return useQuery({
    queryKey: [...rankQueryKeys.activityHistory(userId ?? ''), limit],
    queryFn: () => rankService.getActivityHistory(userId!, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 dakika
  });
}

/**
 * XP kazanma mutation hook'u
 */
export function useGainXp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, activity, referenceId, referenceType }: {
      userId: string;
      activity: RankActivity;
      referenceId?: string;
      referenceType?: 'lobby' | 'tournament' | 'match';
    }) => rankService.addXp(userId, activity, referenceId, referenceType),
    onSuccess: (_, variables) => {
      // Kullanıcı rütbe verisini yenile
      queryClient.invalidateQueries({
        queryKey: rankQueryKeys.userRank(variables.userId),
      });
      // Aktivite geçmişini yenile
      queryClient.invalidateQueries({
        queryKey: rankQueryKeys.activityHistory(variables.userId),
      });
    },
  });
}

/**
 * Liderlik tablosu hook'u
 */
export function useRankLeaderboard(limit = 10) {
  return useQuery({
    queryKey: [...rankQueryKeys.leaderboard(), limit],
    queryFn: () => rankService.getLeaderboard(limit),
    staleTime: 10 * 60 * 1000, // 10 dakika
  });
}

/**
 * Rütbe hesaplama yardımcı hook'u
 * Mock verilerle veya gerçek verilerle çalışır
 */
export function useRankCalculations(totalXp: number) {
  return useMemo(() => {
    const currentTier = calculateRankFromXp(totalXp);
    const config = getRankConfig(currentTier);
    const nextTier = getNextRank(currentTier);
    const nextConfig = nextTier ? RANK_CONFIGS[nextTier] : null;
    
    const currentTierXp = totalXp - config.minXp;
    const xpToNextTier = nextConfig ? nextConfig.minXp - totalXp : 0;
    const progressPercentage = calculateProgressPercentage(totalXp, currentTier);
    
    return {
      currentTier,
      config,
      nextTier,
      nextConfig,
      currentTierXp,
      xpToNextTier,
      progressPercentage,
      isMaxRank: currentTier === RANK_TIER.MASTER,
    };
  }, [totalXp]);
}

/**
 * Rütbe gereksinimi kontrolü hook'u
 */
export function useRankRequirement(
  userTier: RankTier | undefined,
  requiredTier: RankTier | undefined
) {
  return useMemo(() => {
    if (!userTier || !requiredTier) return true;
    return meetsRankRequirement(userTier, requiredTier);
  }, [userTier, requiredTier]);
}

/**
 * XP ödül bilgisi hook'u
 */
export function useXpRewardInfo(activity: RankActivity) {
  return useMemo(() => {
    return XP_REWARD_RULES[activity] ?? null;
  }, [activity]);
}

/**
 * Mock rütbe verisi oluşturucu (geliştirme/test için)
 */
export function useMockRankData(userId: string): UserRankData {
  return useMemo(() => {
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
      activityHistory: [],
      updatedAt: new Date().toISOString(),
    };
  }, [userId]);
}

/**
 * Tam donanımlı rütbe hook'u
 * Tüm rütbe verilerini ve işlemlerini içerir
 */
export function useRank(userId: string | undefined) {
  const queryClient = useQueryClient();
  
  const {
    data: rankData,
    isLoading: isRankLoading,
    error: rankError,
  } = useUserRank(userId);

  const {
    data: activityHistory,
    isLoading: isActivityLoading,
  } = useRankActivityHistory(userId);

  const gainXpMutation = useGainXp();

  // Hesaplanmış değerler
  const calculations = useRankCalculations(rankData?.totalXp ?? 0);

  // XP kazanma fonksiyonu
  const gainXp = useCallback(async (
    activity: RankActivity,
    referenceId?: string,
    referenceType?: 'lobby' | 'tournament' | 'match'
  ) => {
    if (!userId) return;
    
    return gainXpMutation.mutateAsync({
      userId,
      activity,
      referenceId,
      referenceType,
    });
  }, [userId, gainXpMutation]);

  // Verileri yenile
  const refresh = useCallback(() => {
    if (!userId) return;
    
    queryClient.invalidateQueries({
      queryKey: rankQueryKeys.userRank(userId),
    });
    queryClient.invalidateQueries({
      queryKey: rankQueryKeys.activityHistory(userId),
    });
  }, [userId, queryClient]);

  return {
    // Veriler
    rankData,
    activityHistory: activityHistory ?? [],
    
    // Hesaplanmış değerler
    ...calculations,
    
    // Durumlar
    isLoading: isRankLoading || isActivityLoading,
    isGainingXp: gainXpMutation.isPending,
    error: rankError,
    
    // Aksiyonlar
    gainXp,
    refresh,
  };
}

export default useRank;
