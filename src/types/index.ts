// Global TypeScript type tanımlamaları

// ============================================================================
// API Response Types
// ============================================================================

/**
 * API yanıt tipi
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Sayfalama meta verisi
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Sayfalanmış API yanıtı
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// ============================================================================
// Status & Game Type Constants
// ============================================================================

/**
 * Turnuva durumu
 */
export const TOURNAMENT_STATUS = {
  UPCOMING: 'upcoming',
  REGISTRATION_OPEN: 'registration_open',
  REGISTRATION_CLOSED: 'registration_closed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type TournamentStatus = typeof TOURNAMENT_STATUS[keyof typeof TOURNAMENT_STATUS];

/**
 * Lobi durumu
 */
export const LOBBY_STATUS = {
  WAITING: 'waiting',
  FULL: 'full',
  IN_GAME: 'in_game',
  CLOSED: 'closed',
} as const;

export type LobbyStatus = typeof LOBBY_STATUS[keyof typeof LOBBY_STATUS];

/**
 * Oyun tipi
 */
export const GAME_TYPE = {
  VALORANT: 'valorant',
  LOL: 'lol',
  TFT: 'tft',
  WILD_RIFT: 'wild_rift',
  PUBG_MOBILE: 'pubg_mobile',
  WARROCK: 'warrock',
  HAXBALL: 'haxball',
  ROCKET_LEAGUE: 'rocket_league',
  FALL_GUYS: 'fall_guys',
} as const;

export type GameType = typeof GAME_TYPE[keyof typeof GAME_TYPE];

/**
 * Kullanıcı rütbeleri
 * @deprecated features/rank modülünü kullanın
 */
export const USER_RANK = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  MASTERY: 'mastery',
  MASTER: 'master',
} as const;

export type UserRank = typeof USER_RANK[keyof typeof USER_RANK];

// Yeni rütbe sistemini re-export et
export {
  RANK_TIER,
  RANK_ACTIVITY,
  type RankTier,
  type RankActivity,
  type RankConfig,
  type UserRankData,
  type RankActivityLog,
} from '@/features/rank';

// ============================================================================
// User Types
// ============================================================================

/**
 * Kullanıcı temel tipi
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Kullanıcı profil detayları
 */
export interface UserProfile extends User {
  /** Profil fotoğrafı URL'i */
  profileImageUrl: string | null;
  /** Kullanıcı rütbesi */
  rank: UserRank;
  /** Kullanıcının katıldığı turnuva ID'leri */
  participatedTournamentIds: string[];
  /** Toplam oynanan maç sayısı */
  totalMatchesPlayed: number;
  /** Kazanılan maç sayısı */
  matchesWon: number;
  /** Kullanıcı biyografisi */
  bio?: string;
  /** Sosyal medya bağlantıları */
  socialLinks?: {
    discord?: string;
    twitter?: string;
    twitch?: string;
  };
}

/**
 * Kullanıcı özet bilgisi (liste görünümü için)
 */
export interface UserSummary {
  id: string;
  username: string;
  avatarUrl: string | null;
  rank: UserRank;
}

// ============================================================================
// Tournament Types
// ============================================================================

/**
 * Ödül havuzu detayları
 */
export interface PrizePool {
  /** Toplam ödül miktarı */
  total: number;
  /** Para birimi (TRY, USD, EUR vb.) */
  currency: string;
  /** Sıralamaya göre ödül dağılımı */
  distribution?: {
    place: number;
    amount: number;
  }[];
}

/**
 * Turnuva türü (Online/Offline)
 */
export const TOURNAMENT_TYPE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export type TournamentType = typeof TOURNAMENT_TYPE[keyof typeof TOURNAMENT_TYPE];

/**
 * Turnuva tipi
 */
export interface Tournament {
  /** Benzersiz turnuva ID'si */
  id: string;
  /** Turnuva başlığı */
  title: string;
  /** Turnuva açıklaması */
  description?: string;
  /** Turnuva görseli URL'i */
  imageUrl: string;
  /** Banner görseli URL'i */
  bannerUrl?: string;
  /** Ödül havuzu */
  prizePool: PrizePool;
  /** Maksimum katılımcı sayısı */
  maxParticipants: number;
  /** Mevcut katılımcı sayısı */
  currentParticipants: number;
  /** Turnuva durumu */
  status: TournamentStatus;
  /** Turnuva türü (online/offline) */
  type: TournamentType;
  /** Oyun türü */
  gameType: GameType;
  /** Turnuva başlangıç tarihi */
  startDate: string;
  /** Turnuva bitiş tarihi */
  endDate?: string;
  /** Kayıt başlangıç tarihi */
  registrationStartDate: string;
  /** Kayıt bitiş tarihi */
  registrationEndDate: string;
  /** Turnuva kuralları */
  rules?: string;
  /** Turnuva organizatörü */
  organizer: UserSummary;
  /** Lokasyon (offline turnuvalar için) */
  location?: {
    city: string;
    venue?: string;
    address?: string;
  };
  /** Oluşturulma tarihi */
  createdAt: string;
  /** Güncellenme tarihi */
  updatedAt: string;
}

/**
 * Turnuva özet bilgisi (kart görünümü için)
 */
export interface TournamentCard {
  id: string;
  title: string;
  imageUrl: string;
  prizePool: PrizePool;
  currentParticipants: number;
  maxParticipants: number;
  status: TournamentStatus;
  type: TournamentType;
  gameType: GameType;
  startDate: string;
  /** Lokasyon (offline turnuvalar için) */
  location?: {
    city: string;
    venue?: string;
  };
}

// ============================================================================
// Lobby Types
// ============================================================================

/**
 * Lobi tipi
 */
export interface Lobby {
  /** Benzersiz lobi ID'si */
  id: string;
  /** Lobi başlığı */
  title: string;
  /** Lobi açıklaması */
  description?: string;
  /** Lobi kurucusu */
  creator: UserSummary;
  /** Oyun türü */
  gameType: GameType;
  /** Maksimum oyuncu kapasitesi */
  maxPlayers: number;
  /** Mevcut oyuncu sayısı */
  currentPlayers: number;
  /** Boş yer sayısı (hesaplanmış) */
  availableSlots: number;
  /** Lobideki oyuncular */
  players: UserSummary[];
  /** Lobi durumu */
  status: LobbyStatus;
  /** Minimum rütbe gereksinimi */
  minRankRequired?: UserRank;
  /** Şifre korumalı mı */
  isPasswordProtected: boolean;
  /** Lobi bölgesi */
  region?: string;
  /** Oluşturulma tarihi */
  createdAt: string;
  /** Son güncelleme tarihi */
  updatedAt: string;
}

/**
 * Lobi özet bilgisi (liste görünümü için)
 */
export interface LobbySummary {
  id: string;
  title: string;
  creator: UserSummary;
  gameType: GameType;
  currentPlayers: number;
  maxPlayers: number;
  availableSlots: number;
  status: LobbyStatus;
  isPasswordProtected: boolean;
}

/**
 * Lobi oluşturma formu için input tipi
 */
export interface CreateLobbyInput {
  title: string;
  description?: string;
  gameType: GameType;
  maxPlayers: number;
  password?: string;
  minRankRequired?: UserRank;
  region?: string;
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Turnuva aktif mi kontrolü için yardımcı tip
 */
export type ActiveTournamentStatus = typeof TOURNAMENT_STATUS.IN_PROGRESS | typeof TOURNAMENT_STATUS.REGISTRATION_OPEN;

/**
 * Turnuva bitmiş mi kontrolü için yardımcı tip
 */
export type CompletedTournamentStatus = typeof TOURNAMENT_STATUS.COMPLETED | typeof TOURNAMENT_STATUS.CANCELLED;

// ============================================================================
// Match Types (Maç Odası için)
// ============================================================================

/**
 * Maç durumu
 */
export const MATCH_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  AWAITING_RESULT: 'awaiting_result',
  DISPUTED: 'disputed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type MatchStatus = typeof MATCH_STATUS[keyof typeof MATCH_STATUS];

/**
 * Takım tipi
 */
export interface Team {
  id: string;
  name: string;
  logoUrl: string | null;
  players: UserSummary[];
  captain: UserSummary;
}

/**
 * Maç tipi
 */
export interface Match {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  gameType: GameType;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  screenshotUrl?: string;
  winner?: 'teamA' | 'teamB' | null;
}

/**
 * Chat mesaj tipi
 */
export interface ChatMessage {
  id: string;
  matchId: string;
  sender: UserSummary;
  content: string;
  timestamp: string;
  isSystemMessage: boolean;
}

/**
 * Screenshot kanıt tipi
 */
export interface MatchEvidence {
  id: string;
  matchId: string;
  uploadedBy: UserSummary;
  imageUrl: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
