// Rütbe Sistemi - Type Tanımlamaları

/**
 * Rütbe seviyeleri
 * Bronz'dan Master'a kadar 7 seviye
 */
export const RANK_TIER = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  MASTERY: 'mastery',
  MASTER: 'master',
} as const;

export type RankTier = typeof RANK_TIER[keyof typeof RANK_TIER];

/**
 * Rütbe sıralaması (index ile karşılaştırma için)
 */
export const RANK_ORDER: RankTier[] = [
  RANK_TIER.BRONZE,
  RANK_TIER.SILVER,
  RANK_TIER.GOLD,
  RANK_TIER.PLATINUM,
  RANK_TIER.DIAMOND,
  RANK_TIER.MASTERY,
  RANK_TIER.MASTER,
];

/**
 * XP Kazanma Aktiviteleri
 */
export const RANK_ACTIVITY = {
  CREATE_LOBBY: 'create_lobby',
  JOIN_LOBBY: 'join_lobby',
  JOIN_TOURNAMENT: 'join_tournament',
  WIN_MATCH: 'win_match',
  COMPLETE_MATCH: 'complete_match',
  FIRST_BLOOD: 'first_blood', // İlk maç bonusu
  WIN_STREAK: 'win_streak', // Galibiyet serisi bonusu
  TOURNAMENT_TOP_3: 'tournament_top_3',
  TOURNAMENT_WINNER: 'tournament_winner',
} as const;

export type RankActivity = typeof RANK_ACTIVITY[keyof typeof RANK_ACTIVITY];

/**
 * Rütbe renk şeması
 */
export interface RankColorScheme {
  /** Ana renk (gradient başlangıç) */
  primary: string;
  /** İkincil renk (gradient bitiş) */
  secondary: string;
  /** Glow/parlama rengi */
  glow: string;
  /** Metin rengi */
  text: string;
  /** Arka plan rengi (karartılmış) */
  background: string;
  /** Border rengi */
  border: string;
}

/**
 * Rütbe konfigürasyonu
 */
export interface RankConfig {
  /** Rütbe ID'si */
  tier: RankTier;
  /** Türkçe rütbe adı */
  name: string;
  /** Kısa etiket */
  tag: string;
  /** Açıklama */
  description: string;
  /** Minimum XP gereksinimi */
  minXp: number;
  /** Maksimum XP (bir sonraki rütbeye geçiş noktası) */
  maxXp: number;
  /** Renk şeması */
  colors: RankColorScheme;
  /** İkon adı (Lucide icon) */
  icon: string;
  /** Özel yetkiler */
  perks: string[];
}

/**
 * Kullanıcı rütbe verisi
 */
export interface UserRankData {
  /** Kullanıcı ID'si */
  userId: string;
  /** Mevcut rütbe */
  currentTier: RankTier;
  /** Toplam XP */
  totalXp: number;
  /** Mevcut rütbe içindeki XP */
  currentTierXp: number;
  /** Bir sonraki rütbeye kalan XP */
  xpToNextTier: number;
  /** İlerleme yüzdesi (0-100) */
  progressPercentage: number;
  /** Aktivite geçmişi */
  activityHistory: RankActivityLog[];
  /** Son güncelleme tarihi */
  updatedAt: string;
}

/**
 * XP kazanma logu
 */
export interface RankActivityLog {
  /** Log ID'si */
  id: string;
  /** Aktivite tipi */
  activity: RankActivity;
  /** Kazanılan XP */
  xpGained: number;
  /** Açıklama */
  description: string;
  /** Tarih */
  timestamp: string;
  /** İlgili referans (lobi ID, turnuva ID vb.) */
  referenceId?: string;
  /** Referans tipi */
  referenceType?: 'lobby' | 'tournament' | 'match';
}

/**
 * XP kazanım kuralları
 */
export interface XpRewardRule {
  /** Aktivite tipi */
  activity: RankActivity;
  /** Baz XP miktarı */
  baseXp: number;
  /** Açıklama */
  description: string;
  /** Günlük limit (opsiyonel) */
  dailyLimit?: number;
  /** Çarpan koşulu (opsiyonel) */
  multiplierCondition?: string;
}

/**
 * Rütbe karşılaştırma sonucu
 */
export type RankComparisonResult = 'higher' | 'lower' | 'equal';

/**
 * Rütbe istatistikleri
 */
export interface RankStats {
  /** Toplam kullanıcı sayısı (rütbe bazında) */
  totalUsersPerTier: Record<RankTier, number>;
  /** En yüksek XP'li kullanıcılar */
  topUsers: {
    userId: string;
    username: string;
    totalXp: number;
    tier: RankTier;
  }[];
  /** Son 24 saatte kazanılan toplam XP */
  last24hXpGained: number;
}
