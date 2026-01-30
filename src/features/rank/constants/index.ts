// Rütbe Sistemi - Sabitler ve Konfigürasyonlar

import {
  RANK_TIER,
  RANK_ACTIVITY,
  type RankConfig,
  type XpRewardRule,
  type RankTier,
} from '../types';

/**
 * Rütbe Konfigürasyonları
 * Her rütbe için detaylı ayarlar
 */
export const RANK_CONFIGS: Record<RankTier, RankConfig> = {
  [RANK_TIER.BRONZE]: {
    tier: RANK_TIER.BRONZE,
    name: 'Bronz',
    tag: 'BRZ',
    description: 'Yolculuğuna yeni başlayanlar için',
    minXp: 0,
    maxXp: 500,
    colors: {
      primary: '#CD7F32',
      secondary: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.4)',
      text: '#CD7F32',
      background: 'rgba(205, 127, 50, 0.1)',
      border: 'rgba(205, 127, 50, 0.3)',
    },
    icon: 'Shield',
    perks: [
      'Temel profil rozeti',
      'Lobi kurma yetkisi',
    ],
  },
  [RANK_TIER.SILVER]: {
    tier: RANK_TIER.SILVER,
    name: 'Gümüş',
    tag: 'SLV',
    description: 'Deneyim kazanmaya başlayanlar',
    minXp: 500,
    maxXp: 1500,
    colors: {
      primary: '#C0C0C0',
      secondary: '#808080',
      glow: 'rgba(192, 192, 192, 0.4)',
      text: '#C0C0C0',
      background: 'rgba(192, 192, 192, 0.1)',
      border: 'rgba(192, 192, 192, 0.3)',
    },
    icon: 'ShieldCheck',
    perks: [
      'Gümüş profil rozeti',
      'Özel lobi filtresi',
      'Profil özelleştirme',
    ],
  },
  [RANK_TIER.GOLD]: {
    tier: RANK_TIER.GOLD,
    name: 'Altın',
    tag: 'GLD',
    description: 'Yeteneklerini kanıtlayanlar',
    minXp: 1500,
    maxXp: 3500,
    colors: {
      primary: '#FFD700',
      secondary: '#DAA520',
      glow: 'rgba(255, 215, 0, 0.4)',
      text: '#FFD700',
      background: 'rgba(255, 215, 0, 0.1)',
      border: 'rgba(255, 215, 0, 0.3)',
    },
    icon: 'Award',
    perks: [
      'Altın profil rozeti',
      'Öncelikli lobi eşleştirme',
      'Özel turnuvalara erişim',
      'Profil animasyonları',
    ],
  },
  [RANK_TIER.PLATINUM]: {
    tier: RANK_TIER.PLATINUM,
    name: 'Platinum',
    tag: 'PLT',
    description: 'Elit oyuncular arasında yer alanlar',
    minXp: 3500,
    maxXp: 7000,
    colors: {
      primary: '#00CED1',
      secondary: '#008B8B',
      glow: 'rgba(0, 206, 209, 0.4)',
      text: '#00CED1',
      background: 'rgba(0, 206, 209, 0.1)',
      border: 'rgba(0, 206, 209, 0.3)',
    },
    icon: 'Crown',
    perks: [
      'Platinum profil rozeti',
      'Özel lobiler oluşturma',
      'Turnuva önceliği',
      'Beta özelliklere erişim',
      'Özel Discord rolü',
    ],
  },
  [RANK_TIER.DIAMOND]: {
    tier: RANK_TIER.DIAMOND,
    name: 'Elmas',
    tag: 'DIA',
    description: 'Parıldayan yetenekler',
    minXp: 7000,
    maxXp: 12000,
    colors: {
      primary: '#00BFFF',
      secondary: '#1E90FF',
      glow: 'rgba(0, 191, 255, 0.5)',
      text: '#00BFFF',
      background: 'rgba(0, 191, 255, 0.1)',
      border: 'rgba(0, 191, 255, 0.3)',
    },
    icon: 'Gem',
    perks: [
      'Elmas profil rozeti',
      'VIP lobi oluşturma',
      'Turnuva organizasyonu',
      'Özel etkinliklere davet',
      'Sponsor fırsatları',
      'Özel profil efektleri',
    ],
  },
  [RANK_TIER.MASTERY]: {
    tier: RANK_TIER.MASTERY,
    name: 'Ustalık',
    tag: 'MST',
    description: 'Oyun sanatında ustalaşanlar',
    minXp: 12000,
    maxXp: 20000,
    colors: {
      primary: '#9400D3',
      secondary: '#4B0082',
      glow: 'rgba(148, 0, 211, 0.5)',
      text: '#9400D3',
      background: 'rgba(148, 0, 211, 0.1)',
      border: 'rgba(148, 0, 211, 0.3)',
    },
    icon: 'Sparkles',
    perks: [
      'Ustalık profil rozeti',
      'Mentor programına katılım',
      'Turnuva hakemliği',
      'Topluluk etkinlikleri oluşturma',
      'Özel merchandise',
      'Animasyonlu profil çerçevesi',
      'Aylık ödül çekilişi',
    ],
  },
  [RANK_TIER.MASTER]: {
    tier: RANK_TIER.MASTER,
    name: 'Master',
    tag: 'MAS',
    description: 'Efsanelerin arasına katılanlar',
    minXp: 20000,
    maxXp: Infinity,
    colors: {
      primary: '#FF4500',
      secondary: '#DC143C',
      glow: 'rgba(255, 69, 0, 0.6)',
      text: '#FF4500',
      background: 'rgba(255, 69, 0, 0.15)',
      border: 'rgba(255, 69, 0, 0.4)',
    },
    icon: 'Flame',
    perks: [
      'Master profil rozeti',
      'Tüm önceki yetkiler',
      'Özel Master sıralaması',
      'Platform danışmanlığı',
      'Özel turnuva ödül havuzları',
      'Yıllık Master etkinliği',
      'Efsane profil efektleri',
      'Sınırsız lobi oluşturma',
    ],
  },
};

/**
 * XP Kazanım Kuralları
 * Her aktivite için kazanılacak XP miktarı
 */
export const XP_REWARD_RULES: Record<string, XpRewardRule> = {
  [RANK_ACTIVITY.CREATE_LOBBY]: {
    activity: RANK_ACTIVITY.CREATE_LOBBY,
    baseXp: 25,
    description: 'Lobi oluşturma',
    dailyLimit: 5,
  },
  [RANK_ACTIVITY.JOIN_LOBBY]: {
    activity: RANK_ACTIVITY.JOIN_LOBBY,
    baseXp: 15,
    description: 'Lobiye katılma',
    dailyLimit: 10,
  },
  [RANK_ACTIVITY.JOIN_TOURNAMENT]: {
    activity: RANK_ACTIVITY.JOIN_TOURNAMENT,
    baseXp: 50,
    description: 'Turnuvaya katılma',
    dailyLimit: 3,
  },
  [RANK_ACTIVITY.COMPLETE_MATCH]: {
    activity: RANK_ACTIVITY.COMPLETE_MATCH,
    baseXp: 30,
    description: 'Maç tamamlama',
    dailyLimit: 20,
  },
  [RANK_ACTIVITY.WIN_MATCH]: {
    activity: RANK_ACTIVITY.WIN_MATCH,
    baseXp: 50,
    description: 'Maç kazanma',
    dailyLimit: 20,
  },
  [RANK_ACTIVITY.FIRST_BLOOD]: {
    activity: RANK_ACTIVITY.FIRST_BLOOD,
    baseXp: 100,
    description: 'İlk maç bonusu',
    dailyLimit: 1,
  },
  [RANK_ACTIVITY.WIN_STREAK]: {
    activity: RANK_ACTIVITY.WIN_STREAK,
    baseXp: 25,
    description: 'Galibiyet serisi bonusu (her 3 galibiyette)',
    multiplierCondition: 'Her 3 ardışık galibiyet için',
  },
  [RANK_ACTIVITY.TOURNAMENT_TOP_3]: {
    activity: RANK_ACTIVITY.TOURNAMENT_TOP_3,
    baseXp: 150,
    description: 'Turnuvada ilk 3\'e girme',
  },
  [RANK_ACTIVITY.TOURNAMENT_WINNER]: {
    activity: RANK_ACTIVITY.TOURNAMENT_WINNER,
    baseXp: 300,
    description: 'Turnuva şampiyonluğu',
  },
};

/**
 * Rütbe adını al
 */
export function getRankName(tier: RankTier): string {
  return RANK_CONFIGS[tier]?.name ?? tier;
}

/**
 * Rütbe konfigürasyonunu al
 */
export function getRankConfig(tier: RankTier): RankConfig {
  return RANK_CONFIGS[tier];
}

/**
 * XP'ye göre rütbe hesapla
 */
export function calculateRankFromXp(totalXp: number): RankTier {
  // En yüksek rütbeden başlayarak kontrol et
  const tiers = Object.values(RANK_TIER).reverse() as RankTier[];
  
  for (const tier of tiers) {
    const config = RANK_CONFIGS[tier];
    if (totalXp >= config.minXp) {
      return tier;
    }
  }
  
  return RANK_TIER.BRONZE;
}

/**
 * Bir sonraki rütbeyi al
 */
export function getNextRank(currentTier: RankTier): RankTier | null {
  const tiers = Object.values(RANK_TIER) as RankTier[];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tiers.length - 1) {
    return null; // Zaten en yüksek rütbe
  }
  
  return tiers[currentIndex + 1];
}

/**
 * İlerleme yüzdesini hesapla
 */
export function calculateProgressPercentage(totalXp: number, tier: RankTier): number {
  const config = RANK_CONFIGS[tier];
  const nextTier = getNextRank(tier);
  
  if (!nextTier) {
    return 100; // Master seviyesi, tam dolu
  }
  
  const currentTierXp = totalXp - config.minXp;
  const xpNeeded = config.maxXp - config.minXp;
  
  return Math.min(Math.round((currentTierXp / xpNeeded) * 100), 100);
}

/**
 * İki rütbeyi karşılaştır
 */
export function compareRanks(rank1: RankTier, rank2: RankTier): number {
  const tiers = Object.values(RANK_TIER) as RankTier[];
  return tiers.indexOf(rank1) - tiers.indexOf(rank2);
}

/**
 * Rütbe gereksinimini kontrol et
 */
export function meetsRankRequirement(userTier: RankTier, requiredTier: RankTier): boolean {
  return compareRanks(userTier, requiredTier) >= 0;
}
