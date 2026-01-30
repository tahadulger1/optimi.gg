/**
 * Mock Data - Backend hazır olana kadar kullanılacak sahte veriler
 * 
 * Bu dosya geliştirme aşamasında kullanılmak üzere hazırlanmıştır.
 * Backend entegrasyonu tamamlandığında, bu veriler API'den gelecektir.
 */

import {
  type TournamentCard,
  type Tournament,
  type Lobby,
  type UserSummary,
  type Match,
  type ChatMessage,
  type Team,
  TOURNAMENT_STATUS,
  TOURNAMENT_TYPE,
  GAME_TYPE,
  LOBBY_STATUS,
  USER_RANK,
  MATCH_STATUS,
  type GameType,
  type TournamentStatus,
  type TournamentType,
  type UserRank,
  type LobbyStatus,
  type MatchStatus,
} from "@/types";

// ============================================================================
// Turnuva Durumu Etiketleri
// ============================================================================

export const TOURNAMENT_STATUS_LABELS = {
  [TOURNAMENT_STATUS.UPCOMING]: { text: "YAKINDA", className: "bg-blue-500 text-white" },
  [TOURNAMENT_STATUS.REGISTRATION_OPEN]: { text: "KAYITLAR AÇIK", className: "bg-emerald-500 text-white" },
  [TOURNAMENT_STATUS.REGISTRATION_CLOSED]: { text: "KAYITLAR KAPANDI", className: "bg-orange-500 text-white" },
  [TOURNAMENT_STATUS.IN_PROGRESS]: { text: "DEVAM EDİYOR", className: "bg-amber-500 text-black" },
  [TOURNAMENT_STATUS.COMPLETED]: { text: "TAMAMLANDI", className: "bg-gray-500 text-white" },
  [TOURNAMENT_STATUS.CANCELLED]: { text: "İPTAL EDİLDİ", className: "bg-red-500 text-white" },
} as const;

// ============================================================================
// Oyun Tipi Etiketleri
// ============================================================================

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  [GAME_TYPE.VALORANT]: "Valorant",
  [GAME_TYPE.LOL]: "League of Legends",
  [GAME_TYPE.TFT]: "Teamfight Tactics",
  [GAME_TYPE.WILD_RIFT]: "Wild Rift",
  [GAME_TYPE.PUBG_MOBILE]: "PUBG Mobile",
  [GAME_TYPE.WARROCK]: "Warrock",
  [GAME_TYPE.HAXBALL]: "Haxball",
  [GAME_TYPE.ROCKET_LEAGUE]: "Rocket League",
  [GAME_TYPE.FALL_GUYS]: "Fall Guys",
} as const;

// ============================================================================
// Mock Turnuva Verileri (10 Adet)
// ============================================================================

export const mockTournaments: TournamentCard[] = [
  // OFFLINE TURNUVALAR
  {
    id: "trn-001",
    title: "GG Convention - PUBG Mobile Şampiyonası",
    imageUrl: "/img/tournaments/pubg-mobile.jpg",
    prizePool: {
      total: 15000,
      currency: "TRY",
    },
    currentParticipants: 96,
    maxParticipants: 128,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.OFFLINE,
    gameType: GAME_TYPE.PUBG_MOBILE,
    startDate: "2026-02-15T14:00:00Z",
    location: {
      city: "İstanbul",
      venue: "GG Convention Center",
    },
  },
  {
    id: "trn-006",
    title: "Warrock Klasik - Nostalji Turnuvası",
    imageUrl: "/img/tournaments/warrock.jpg",
    prizePool: {
      total: 10000,
      currency: "TRY",
    },
    currentParticipants: 32,
    maxParticipants: 32,
    status: TOURNAMENT_STATUS.REGISTRATION_CLOSED,
    type: TOURNAMENT_TYPE.OFFLINE,
    gameType: GAME_TYPE.WARROCK,
    startDate: "2026-01-28T17:00:00Z",
    location: {
      city: "Ankara",
      venue: "Espor Arena",
    },
  },
  {
    id: "trn-011",
    title: "İstanbul Espor Festivali - Valorant",
    imageUrl: "/img/tournaments/valorant-lan.jpg",
    prizePool: {
      total: 50000,
      currency: "TRY",
    },
    currentParticipants: 48,
    maxParticipants: 64,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.OFFLINE,
    gameType: GAME_TYPE.VALORANT,
    startDate: "2026-03-15T10:00:00Z",
    location: {
      city: "İstanbul",
      venue: "Lütfi Kırdar Kongre Merkezi",
    },
  },
  {
    id: "trn-012",
    title: "Üniversiteler Arası LoL Şampiyonası",
    imageUrl: "/img/tournaments/uni-lol.jpg",
    prizePool: {
      total: 30000,
      currency: "TRY",
    },
    currentParticipants: 32,
    maxParticipants: 32,
    status: TOURNAMENT_STATUS.UPCOMING,
    type: TOURNAMENT_TYPE.OFFLINE,
    gameType: GAME_TYPE.LOL,
    startDate: "2026-04-01T12:00:00Z",
    location: {
      city: "Ankara",
      venue: "ODTÜ Kültür Merkezi",
    },
  },
  {
    id: "trn-013",
    title: "İzmir Gaming Fest - Rocket League",
    imageUrl: "/img/tournaments/izmir-rl.jpg",
    prizePool: {
      total: 15000,
      currency: "TRY",
    },
    currentParticipants: 16,
    maxParticipants: 24,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.OFFLINE,
    gameType: GAME_TYPE.ROCKET_LEAGUE,
    startDate: "2026-03-22T14:00:00Z",
    location: {
      city: "İzmir",
      venue: "Alsancak Espor Arena",
    },
  },

  // ONLINE TURNUVALAR
  {
    id: "trn-002",
    title: "Valorant Türkiye Ligi - Kış Sezonu",
    imageUrl: "/img/tournaments/valorant.jpg",
    prizePool: {
      total: 25000,
      currency: "TRY",
    },
    currentParticipants: 128,
    maxParticipants: 128,
    status: TOURNAMENT_STATUS.IN_PROGRESS,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.VALORANT,
    startDate: "2026-01-20T18:00:00Z",
  },
  {
    id: "trn-003",
    title: "League of Legends - Açık Turnuva",
    imageUrl: "/img/tournaments/lol.jpg",
    prizePool: {
      total: 20000,
      currency: "TRY",
    },
    currentParticipants: 48,
    maxParticipants: 64,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.LOL,
    startDate: "2026-02-01T16:00:00Z",
  },
  {
    id: "trn-004",
    title: "Rocket League 3v3 Turnuvası",
    imageUrl: "/img/tournaments/rocket-league.jpg",
    prizePool: {
      total: 8000,
      currency: "TRY",
    },
    currentParticipants: 24,
    maxParticipants: 32,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.ROCKET_LEAGUE,
    startDate: "2026-02-10T15:00:00Z",
  },
  {
    id: "trn-005",
    title: "Fall Guys - Eğlence Turnuvası",
    imageUrl: "/img/tournaments/fall-guys.jpg",
    prizePool: {
      total: 5000,
      currency: "TRY",
    },
    currentParticipants: 56,
    maxParticipants: 64,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.FALL_GUYS,
    startDate: "2026-02-05T19:00:00Z",
  },
  {
    id: "trn-007",
    title: "TFT Set 14 - Ranked Turnuvası",
    imageUrl: "/img/tournaments/tft.jpg",
    prizePool: {
      total: 6000,
      currency: "TRY",
    },
    currentParticipants: 16,
    maxParticipants: 64,
    status: TOURNAMENT_STATUS.UPCOMING,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.TFT,
    startDate: "2026-02-20T14:00:00Z",
  },
  {
    id: "trn-008",
    title: "Haxball 2v2 Şampiyonası",
    imageUrl: "/img/tournaments/haxball.jpg",
    prizePool: {
      total: 3000,
      currency: "TRY",
    },
    currentParticipants: 28,
    maxParticipants: 32,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.HAXBALL,
    startDate: "2026-02-08T20:00:00Z",
  },
  {
    id: "trn-009",
    title: "Wild Rift Türkiye Kupası",
    imageUrl: "/img/tournaments/wild-rift.jpg",
    prizePool: {
      total: 12000,
      currency: "TRY",
    },
    currentParticipants: 64,
    maxParticipants: 64,
    status: TOURNAMENT_STATUS.COMPLETED,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.WILD_RIFT,
    startDate: "2026-01-10T15:00:00Z",
  },
  {
    id: "trn-010",
    title: "PUBG Mobile - Duo Showdown",
    imageUrl: "/img/tournaments/pubg-duo.jpg",
    prizePool: {
      total: 7500,
      currency: "TRY",
    },
    currentParticipants: 80,
    maxParticipants: 100,
    status: TOURNAMENT_STATUS.REGISTRATION_OPEN,
    type: TOURNAMENT_TYPE.ONLINE,
    gameType: GAME_TYPE.PUBG_MOBILE,
    startDate: "2026-02-12T16:00:00Z",
  },
];

// ============================================================================
// Mock Banner Verileri (Hero Carousel için)
// ============================================================================

export interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  gradient: string;
  ctaText?: string;
  ctaLink?: string;
  tournamentId?: string;
}

export const mockHeroBanners: HeroBannerSlide[] = [
  {
    id: "banner-001",
    title: "GG CONVENTION",
    subtitle: "TURNUVASI",
    description: "Türkiye'nin en büyük espor etkinliğine katıl!",
    imageUrl: "/img/banners/gg-convention.jpg",
    gradient: "from-amber-900/80 via-transparent to-transparent",
    ctaText: "Şimdi Kaydol",
    ctaLink: "/turnuvalar/trn-001",
    tournamentId: "trn-001",
  },
  {
    id: "banner-002",
    title: "VALORANT",
    subtitle: "KIŞ SEZONU",
    description: "25.000₺ ödül havuzlu büyük turnuva başladı!",
    imageUrl: "/img/banners/valorant.jpg",
    gradient: "from-red-900/80 via-transparent to-transparent",
    ctaText: "Turnuvayı İzle",
    ctaLink: "/turnuvalar/trn-002",
    tournamentId: "trn-002",
  },
  {
    id: "banner-003",
    title: "LEAGUE OF LEGENDS",
    subtitle: "AÇIK TURNUVA",
    description: "Kayıtlar açık! Takımını kur ve mücadeleye katıl.",
    imageUrl: "/img/banners/lol.jpg",
    gradient: "from-blue-900/80 via-transparent to-transparent",
    ctaText: "Kayıt Ol",
    ctaLink: "/turnuvalar/trn-003",
    tournamentId: "trn-003",
  },
  {
    id: "banner-004",
    title: "ROCKET LEAGUE",
    subtitle: "3v3 TURNUVASI",
    description: "Hız ve becerinin buluştuğu turnuva!",
    imageUrl: "/img/banners/rocket-league.jpg",
    gradient: "from-orange-900/80 via-transparent to-transparent",
    ctaText: "Detaylar",
    ctaLink: "/turnuvalar/trn-004",
    tournamentId: "trn-004",
  },
];

// ============================================================================
// Öne Çıkan Turnuva ID'si
// ============================================================================

export const FEATURED_TOURNAMENT_ID = "trn-001";

// ============================================================================
// Yardımcı Fonksiyonlar
// ============================================================================

/**
 * Turnuva ID'sine göre turnuva bilgisi döndürür
 */
export function getTournamentById(id: string): TournamentCard | undefined {
  return mockTournaments.find((t) => t.id === id);
}

/**
 * Oyun tipine göre turnuvaları filtreler
 */
export function getTournamentsByGame(gameType: GameType): TournamentCard[] {
  return mockTournaments.filter((t) => t.gameType === gameType);
}

/**
 * Turnuva durumuna göre turnuvaları filtreler
 */
export function getTournamentsByStatus(status: TournamentStatus): TournamentCard[] {
  return mockTournaments.filter((t) => t.status === status);
}

/**
 * Kayıtları açık olan turnuvaları döndürür
 */
export function getOpenTournaments(): TournamentCard[] {
  return mockTournaments.filter((t) => t.status === TOURNAMENT_STATUS.REGISTRATION_OPEN);
}

/**
 * Öne çıkan turnuvayı döndürür
 */
export function getFeaturedTournament(): TournamentCard | undefined {
  return mockTournaments.find((t) => t.id === FEATURED_TOURNAMENT_ID);
}

/**
 * Tarihi Türkçe formatında döndürür
 */
export function formatTurkishDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Ödül miktarını formatlar
 */
export function formatPrize(amount: number, currency: string = "TRY"): string {
  if (currency === "TRY") {
    return `${amount.toLocaleString("tr-TR")}₺`;
  }
  return `${amount.toLocaleString("tr-TR")} ${currency}`;
}

// ============================================================================
// Mock Geçmiş Turnuva Verileri (Kullanıcı Profili için)
// ============================================================================

export interface PastTournament {
  id: string;
  title: string;
  gameType: GameType;
  placement: number;
  totalParticipants: number;
  prizeWon: number;
  currency: string;
  date: string;
}

export const mockPastTournaments: PastTournament[] = [
  {
    id: "past-001",
    title: "Valorant Türkiye Ligi - Sonbahar Sezonu",
    gameType: GAME_TYPE.VALORANT,
    placement: 3,
    totalParticipants: 128,
    prizeWon: 5000,
    currency: "TRY",
    date: "2025-12-15",
  },
  {
    id: "past-002",
    title: "League of Legends - Haftalık Turnuva #24",
    gameType: GAME_TYPE.LOL,
    placement: 1,
    totalParticipants: 64,
    prizeWon: 3000,
    currency: "TRY",
    date: "2025-11-28",
  },
  {
    id: "past-003",
    title: "TFT Set 13 - Ranked Turnuvası",
    gameType: GAME_TYPE.TFT,
    placement: 8,
    totalParticipants: 64,
    prizeWon: 0,
    currency: "TRY",
    date: "2025-11-10",
  },
  {
    id: "past-004",
    title: "Valorant - Gece Turnuvası",
    gameType: GAME_TYPE.VALORANT,
    placement: 2,
    totalParticipants: 32,
    prizeWon: 1500,
    currency: "TRY",
    date: "2025-10-22",
  },
  {
    id: "past-005",
    title: "PUBG Mobile - Duo Championship",
    gameType: GAME_TYPE.PUBG_MOBILE,
    placement: 5,
    totalParticipants: 100,
    prizeWon: 500,
    currency: "TRY",
    date: "2025-10-05",
  },
];

// ============================================================================
// Mock Lobi Verileri
// ============================================================================

/**
 * Rütbe etiketleri ve renkleri
 */
export const USER_RANK_LABELS: Record<UserRank, { text: string; className: string }> = {
  [USER_RANK.BRONZE]: { text: "Bronz", className: "bg-amber-700 text-white" },
  [USER_RANK.SILVER]: { text: "Gümüş", className: "bg-gray-400 text-black" },
  [USER_RANK.GOLD]: { text: "Altın", className: "bg-yellow-500 text-black" },
  [USER_RANK.PLATINUM]: { text: "Platin", className: "bg-cyan-400 text-black" },
  [USER_RANK.DIAMOND]: { text: "Elmas", className: "bg-blue-500 text-white" },
  [USER_RANK.MASTERY]: { text: "Ustalık", className: "bg-red-600 text-white" },
  [USER_RANK.MASTER]: { text: "Usta", className: "bg-purple-500 text-white" },
} as const;

/**
 * Rütbelerin sıralama değerleri (filtreleme için)
 */
export const USER_RANK_ORDER: Record<UserRank, number> = {
  [USER_RANK.BRONZE]: 1,
  [USER_RANK.SILVER]: 2,
  [USER_RANK.GOLD]: 3,
  [USER_RANK.PLATINUM]: 4,
  [USER_RANK.DIAMOND]: 5,
  [USER_RANK.MASTERY]: 6,
  [USER_RANK.MASTER]: 7,
} as const;

/**
 * Lobi durumu etiketleri
 */
export const LOBBY_STATUS_LABELS: Record<LobbyStatus, { text: string; className: string }> = {
  [LOBBY_STATUS.WAITING]: { text: "Bekliyor", className: "bg-emerald-500 text-white" },
  [LOBBY_STATUS.FULL]: { text: "Dolu", className: "bg-orange-500 text-white" },
  [LOBBY_STATUS.IN_GAME]: { text: "Oyunda", className: "bg-blue-500 text-white" },
  [LOBBY_STATUS.CLOSED]: { text: "Kapalı", className: "bg-gray-500 text-white" },
} as const;

/**
 * Mock kullanıcı verileri
 */
const mockUsers: UserSummary[] = [
  { id: "user-001", username: "ShadowHunter", avatarUrl: null, rank: USER_RANK.DIAMOND },
  { id: "user-002", username: "NightOwl34", avatarUrl: null, rank: USER_RANK.PLATINUM },
  { id: "user-003", username: "ProGamer2023", avatarUrl: null, rank: USER_RANK.MASTER },
  { id: "user-004", username: "TurboKing", avatarUrl: null, rank: USER_RANK.GOLD },
  { id: "user-005", username: "CyberNinja", avatarUrl: null, rank: USER_RANK.MASTERY },
  { id: "user-006", username: "PixelWarrior", avatarUrl: null, rank: USER_RANK.SILVER },
  { id: "user-007", username: "DragonSlayer", avatarUrl: null, rank: USER_RANK.DIAMOND },
  { id: "user-008", username: "StormBreaker", avatarUrl: null, rank: USER_RANK.PLATINUM },
  { id: "user-009", username: "IceQueen", avatarUrl: null, rank: USER_RANK.MASTER },
  { id: "user-010", username: "FirePhoenix", avatarUrl: null, rank: USER_RANK.GOLD },
  { id: "user-011", username: "LightningBolt", avatarUrl: null, rank: USER_RANK.BRONZE },
  { id: "user-012", username: "DarkMatter", avatarUrl: null, rank: USER_RANK.DIAMOND },
];

/**
 * Mock lobi verileri
 */
export const mockLobbies: Lobby[] = [
  {
    id: "lobby-001",
    title: "Valorant Ranked 5v5",
    description: "Sadece ciddi oyuncular! Mikrofon zorunlu.",
    creator: mockUsers[0],
    gameType: GAME_TYPE.VALORANT,
    maxPlayers: 5,
    currentPlayers: 3,
    availableSlots: 2,
    players: [mockUsers[0], mockUsers[1], mockUsers[2]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.GOLD,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T14:00:00Z",
    updatedAt: "2026-01-26T14:30:00Z",
  },
  {
    id: "lobby-002",
    title: "LoL Flex Rankeds",
    description: "5 kişilik takım arıyoruz. Bot lane gerek.",
    creator: mockUsers[2],
    gameType: GAME_TYPE.LOL,
    maxPlayers: 5,
    currentPlayers: 5,
    availableSlots: 0,
    players: [mockUsers[2], mockUsers[3], mockUsers[4], mockUsers[5], mockUsers[6]],
    status: LOBBY_STATUS.FULL,
    minRankRequired: USER_RANK.PLATINUM,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T13:00:00Z",
    updatedAt: "2026-01-26T14:45:00Z",
  },
  {
    id: "lobby-003",
    title: "Valorant Casual",
    description: "Eğlence amaçlı, herkes katılabilir!",
    creator: mockUsers[4],
    gameType: GAME_TYPE.VALORANT,
    maxPlayers: 5,
    currentPlayers: 2,
    availableSlots: 3,
    players: [mockUsers[4], mockUsers[5]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.BRONZE,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T15:00:00Z",
    updatedAt: "2026-01-26T15:10:00Z",
  },
  {
    id: "lobby-004",
    title: "TFT Duo Hyper Roll",
    description: "Hyper roll oynayacak partner arıyorum.",
    creator: mockUsers[6],
    gameType: GAME_TYPE.TFT,
    maxPlayers: 2,
    currentPlayers: 1,
    availableSlots: 1,
    players: [mockUsers[6]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.SILVER,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T14:30:00Z",
    updatedAt: "2026-01-26T14:30:00Z",
  },
  {
    id: "lobby-005",
    title: "LoL ARAM Gece Lobisi",
    description: "Gece ARAM kasmak isteyenler buyursun.",
    creator: mockUsers[7],
    gameType: GAME_TYPE.LOL,
    maxPlayers: 5,
    currentPlayers: 4,
    availableSlots: 1,
    players: [mockUsers[7], mockUsers[8], mockUsers[9], mockUsers[10]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.BRONZE,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T22:00:00Z",
    updatedAt: "2026-01-26T22:15:00Z",
  },
  {
    id: "lobby-006",
    title: "Valorant Immortal+ Only",
    description: "Yüksek elo oyuncular için ciddi lobi.",
    creator: mockUsers[4],
    gameType: GAME_TYPE.VALORANT,
    maxPlayers: 5,
    currentPlayers: 5,
    availableSlots: 0,
    players: [mockUsers[4], mockUsers[2], mockUsers[8], mockUsers[0], mockUsers[11]],
    status: LOBBY_STATUS.IN_GAME,
    minRankRequired: USER_RANK.MASTER,
    isPasswordProtected: true,
    region: "TR",
    createdAt: "2026-01-26T12:00:00Z",
    updatedAt: "2026-01-26T13:00:00Z",
  },
  {
    id: "lobby-007",
    title: "Wild Rift 5v5 Custom",
    description: "Custom maç için takım arkadaşı arıyoruz.",
    creator: mockUsers[9],
    gameType: GAME_TYPE.WILD_RIFT,
    maxPlayers: 5,
    currentPlayers: 3,
    availableSlots: 2,
    players: [mockUsers[9], mockUsers[10], mockUsers[11]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.GOLD,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T16:00:00Z",
    updatedAt: "2026-01-26T16:20:00Z",
  },
  {
    id: "lobby-008",
    title: "Rocket League 3v3",
    description: "Competitive 3v3 için iki kişi lazım.",
    creator: mockUsers[1],
    gameType: GAME_TYPE.ROCKET_LEAGUE,
    maxPlayers: 3,
    currentPlayers: 1,
    availableSlots: 2,
    players: [mockUsers[1]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.PLATINUM,
    isPasswordProtected: false,
    region: "EU",
    createdAt: "2026-01-26T17:00:00Z",
    updatedAt: "2026-01-26T17:00:00Z",
  },
  {
    id: "lobby-009",
    title: "LoL Clash Takımı",
    description: "Bu hafta sonu Clash için takım kuruyoruz.",
    creator: mockUsers[3],
    gameType: GAME_TYPE.LOL,
    maxPlayers: 5,
    currentPlayers: 2,
    availableSlots: 3,
    players: [mockUsers[3], mockUsers[7]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.DIAMOND,
    isPasswordProtected: true,
    region: "TR",
    createdAt: "2026-01-26T10:00:00Z",
    updatedAt: "2026-01-26T11:00:00Z",
  },
  {
    id: "lobby-010",
    title: "PUBG Mobile Squad",
    description: "4 kişilik squad için bir kişi arıyoruz.",
    creator: mockUsers[5],
    gameType: GAME_TYPE.PUBG_MOBILE,
    maxPlayers: 4,
    currentPlayers: 3,
    availableSlots: 1,
    players: [mockUsers[5], mockUsers[6], mockUsers[10]],
    status: LOBBY_STATUS.WAITING,
    minRankRequired: USER_RANK.GOLD,
    isPasswordProtected: false,
    region: "TR",
    createdAt: "2026-01-26T18:00:00Z",
    updatedAt: "2026-01-26T18:30:00Z",
  },
];

// ============================================================================
// Lobi Yardımcı Fonksiyonlar
// ============================================================================

/**
 * Lobi ID'sine göre lobi bilgisi döndürür
 */
export function getLobbyById(id: string): Lobby | undefined {
  return mockLobbies.find((l) => l.id === id);
}

/**
 * Oyun tipine göre lobileri filtreler
 */
export function getLobbiesByGame(gameType: GameType): Lobby[] {
  return mockLobbies.filter((l) => l.gameType === gameType);
}

/**
 * Aktif (bekleyen) lobileri döndürür
 */
export function getActiveLobbies(): Lobby[] {
  return mockLobbies.filter((l) => l.status === LOBBY_STATUS.WAITING);
}

/**
 * Boş yeri olan lobileri döndürür
 */
export function getAvailableLobbies(): Lobby[] {
  return mockLobbies.filter((l) => l.availableSlots > 0 && l.status === LOBBY_STATUS.WAITING);
}

/**
 * Minimum rütbe gereksinimini karşılayan lobileri filtreler
 */
export function getLobbiesByMinRank(maxRank: UserRank): Lobby[] {
  const maxRankOrder = USER_RANK_ORDER[maxRank];
  return mockLobbies.filter((l) => {
    if (!l.minRankRequired) return true;
    return USER_RANK_ORDER[l.minRankRequired] <= maxRankOrder;
  });
}

// ============================================================================
// Mock Maç Verileri (Match Room için)
// ============================================================================

/**
 * Maç durumu etiketleri
 */
export const MATCH_STATUS_LABELS: Record<MatchStatus, { text: string; className: string }> = {
  [MATCH_STATUS.PENDING]: { text: "Bekliyor", className: "bg-gray-500 text-white" },
  [MATCH_STATUS.IN_PROGRESS]: { text: "Devam Ediyor", className: "bg-blue-500 text-white" },
  [MATCH_STATUS.AWAITING_RESULT]: { text: "Sonuç Bekleniyor", className: "bg-amber-500 text-black" },
  [MATCH_STATUS.DISPUTED]: { text: "İtiraz Edildi", className: "bg-red-500 text-white" },
  [MATCH_STATUS.COMPLETED]: { text: "Tamamlandı", className: "bg-emerald-500 text-white" },
  [MATCH_STATUS.CANCELLED]: { text: "İptal Edildi", className: "bg-gray-600 text-white" },
} as const;

/**
 * Mock takımlar
 */
const mockTeamA: Team = {
  id: "team-001",
  name: "Phoenix Esports",
  logoUrl: null,
  players: [
    { id: "user-001", username: "ShadowHunter", avatarUrl: null, rank: USER_RANK.DIAMOND },
    { id: "user-002", username: "NightOwl34", avatarUrl: null, rank: USER_RANK.PLATINUM },
    { id: "user-003", username: "ProGamer2023", avatarUrl: null, rank: USER_RANK.MASTER },
    { id: "user-004", username: "TurboKing", avatarUrl: null, rank: USER_RANK.GOLD },
    { id: "user-005", username: "CyberNinja", avatarUrl: null, rank: USER_RANK.MASTERY },
  ],
  captain: { id: "user-001", username: "ShadowHunter", avatarUrl: null, rank: USER_RANK.DIAMOND },
};

const mockTeamB: Team = {
  id: "team-002",
  name: "Dragon Warriors",
  logoUrl: null,
  players: [
    { id: "user-006", username: "PixelWarrior", avatarUrl: null, rank: USER_RANK.SILVER },
    { id: "user-007", username: "DragonSlayer", avatarUrl: null, rank: USER_RANK.DIAMOND },
    { id: "user-008", username: "StormBreaker", avatarUrl: null, rank: USER_RANK.PLATINUM },
    { id: "user-009", username: "IceQueen", avatarUrl: null, rank: USER_RANK.MASTER },
    { id: "user-010", username: "FirePhoenix", avatarUrl: null, rank: USER_RANK.GOLD },
  ],
  captain: { id: "user-007", username: "DragonSlayer", avatarUrl: null, rank: USER_RANK.DIAMOND },
};

/**
 * Mock maç verileri
 */
export const mockMatches: Match[] = [
  {
    id: "match-001",
    tournamentId: "trn-002",
    tournamentName: "Valorant Türkiye Ligi - Kış Sezonu",
    round: "Çeyrek Final",
    teamA: mockTeamA,
    teamB: mockTeamB,
    scoreA: 0,
    scoreB: 0,
    status: MATCH_STATUS.IN_PROGRESS,
    gameType: GAME_TYPE.VALORANT,
    scheduledAt: "2026-01-26T18:00:00Z",
    startedAt: "2026-01-26T18:05:00Z",
  },
  {
    id: "match-002",
    tournamentId: "trn-003",
    tournamentName: "League of Legends - Açık Turnuva",
    round: "Yarı Final",
    teamA: mockTeamA,
    teamB: mockTeamB,
    scoreA: 2,
    scoreB: 1,
    status: MATCH_STATUS.COMPLETED,
    gameType: GAME_TYPE.LOL,
    scheduledAt: "2026-01-25T16:00:00Z",
    startedAt: "2026-01-25T16:10:00Z",
    completedAt: "2026-01-25T18:30:00Z",
    winner: "teamA",
  },
  {
    id: "match-003",
    tournamentId: "trn-002",
    tournamentName: "Valorant Türkiye Ligi - Kış Sezonu",
    round: "Yarı Final",
    teamA: mockTeamA,
    teamB: mockTeamB,
    scoreA: 1,
    scoreB: 1,
    status: MATCH_STATUS.AWAITING_RESULT,
    gameType: GAME_TYPE.VALORANT,
    scheduledAt: "2026-01-26T20:00:00Z",
    startedAt: "2026-01-26T20:05:00Z",
  },
];

/**
 * Mock chat mesajları
 */
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-001",
    matchId: "match-001",
    sender: { id: "system", username: "Sistem", avatarUrl: null, rank: USER_RANK.BRONZE },
    content: "Maç odası oluşturuldu. Lütfen kurallara uyun.",
    timestamp: "2026-01-26T18:00:00Z",
    isSystemMessage: true,
  },
  {
    id: "msg-002",
    matchId: "match-001",
    sender: mockTeamA.captain,
    content: "Merhaba, hazırız. Map seçimi yapılabilir.",
    timestamp: "2026-01-26T18:01:00Z",
    isSystemMessage: false,
  },
  {
    id: "msg-003",
    matchId: "match-001",
    sender: mockTeamB.captain,
    content: "Selam! Biz de hazırız. Ascent oynayalım mı?",
    timestamp: "2026-01-26T18:02:00Z",
    isSystemMessage: false,
  },
  {
    id: "msg-004",
    matchId: "match-001",
    sender: mockTeamA.players[1],
    content: "Ascent olabilir, sorun yok.",
    timestamp: "2026-01-26T18:02:30Z",
    isSystemMessage: false,
  },
  {
    id: "msg-005",
    matchId: "match-001",
    sender: { id: "system", username: "Sistem", avatarUrl: null, rank: USER_RANK.BRONZE },
    content: "Map seçildi: Ascent. Maç 5 dakika içinde başlayacak.",
    timestamp: "2026-01-26T18:03:00Z",
    isSystemMessage: true,
  },
  {
    id: "msg-006",
    matchId: "match-001",
    sender: mockTeamB.players[2],
    content: "glhf!",
    timestamp: "2026-01-26T18:04:00Z",
    isSystemMessage: false,
  },
  {
    id: "msg-007",
    matchId: "match-001",
    sender: mockTeamA.captain,
    content: "glhf!",
    timestamp: "2026-01-26T18:04:15Z",
    isSystemMessage: false,
  },
  {
    id: "msg-008",
    matchId: "match-001",
    sender: { id: "system", username: "Sistem", avatarUrl: null, rank: USER_RANK.BRONZE },
    content: "Maç başladı!",
    timestamp: "2026-01-26T18:05:00Z",
    isSystemMessage: true,
  },
];

// ============================================================================
// Maç Yardımcı Fonksiyonlar
// ============================================================================

/**
 * Maç ID'sine göre maç bilgisi döndürür
 */
export function getMatchById(id: string): Match | undefined {
  return mockMatches.find((m) => m.id === id);
}

/**
 * Maç ID'sine göre chat mesajlarını döndürür
 */
export function getChatMessagesByMatchId(matchId: string): ChatMessage[] {
  return mockChatMessages.filter((m) => m.matchId === matchId);
}

// ============================================================================
// Mock Etkinlik Verileri
// ============================================================================

import {
  EventCard as EventCardType,
  EVENT_STATUS,
  EVENT_TYPE,
  EVENT_CATEGORY,
} from "@/features/events/types";

/**
 * Mock etkinlik verileri - Buluşmalar, Konuşmalar, Paneller
 */
export const mockEvents: EventCardType[] = [
  // ONLINE ETKİNLİKLER
  {
    id: "event-001",
    title: "Espor'da Kariyer Yolları - Online Panel",
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.PANEL,
    organizer: {
      id: "org-001",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "Online",
      isOnline: true,
      onlineUrl: "https://discord.gg/optimi",
    },
    startDate: "2026-02-15T19:00:00Z",
    currentParticipants: 156,
    maxParticipants: 500,
    tags: ["Panel", "Kariyer", "Online"],
  },
  {
    id: "event-002",
    title: "VALORANT Strateji Workshop - Pro Oyuncularla",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.WORKSHOP,
    gameType: GAME_TYPE.VALORANT,
    organizer: {
      id: "org-002",
      name: "Optimi Academy",
      logoUrl: null,
      type: "company",
    },
    location: {
      city: "Online",
      isOnline: true,
      onlineUrl: "https://twitch.tv/optimi",
    },
    startDate: "2026-02-20T20:00:00Z",
    currentParticipants: 89,
    maxParticipants: 200,
    tags: ["Workshop", "VALORANT", "Eğitim"],
  },
  {
    id: "event-003",
    title: "Espor Yayıncılığı 101 - Webinar Serisi",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800",
    status: EVENT_STATUS.LIVE,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.WEBINAR,
    organizer: {
      id: "org-003",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "Online",
      isOnline: true,
      onlineUrl: "https://zoom.us/optimi-webinar",
    },
    startDate: "2026-01-30T18:00:00Z",
    currentParticipants: 234,
    maxParticipants: 300,
    tags: ["Webinar", "Yayıncılık", "Canlı"],
  },
  {
    id: "event-004",
    title: "Topluluk Discord Buluşması",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.MEETUP,
    organizer: {
      id: "org-004",
      name: "Optimi Community",
      logoUrl: null,
      type: "community",
    },
    location: {
      city: "Online",
      isOnline: true,
      onlineUrl: "https://discord.gg/optimi-community",
    },
    startDate: "2026-02-08T21:00:00Z",
    currentParticipants: 67,
    maxParticipants: 150,
    tags: ["Discord", "Buluşma", "Topluluk"],
  },
  {
    id: "event-005",
    title: "League of Legends Analiz Workshop",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800",
    status: EVENT_STATUS.UPCOMING,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.WORKSHOP,
    gameType: GAME_TYPE.LOL,
    organizer: {
      id: "org-005",
      name: "Optimi Academy",
      logoUrl: null,
      type: "company",
    },
    location: {
      city: "Online",
      isOnline: true,
    },
    startDate: "2026-03-01T19:00:00Z",
    currentParticipants: 45,
    maxParticipants: 100,
    tags: ["Workshop", "LoL", "Analiz"],
  },
  {
    id: "event-006",
    title: "Espor Girişimciliği Sohbeti",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.ONLINE,
    category: EVENT_CATEGORY.NETWORKING,
    organizer: {
      id: "org-006",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "Online",
      isOnline: true,
    },
    startDate: "2026-02-25T20:00:00Z",
    currentParticipants: 78,
    maxParticipants: 100,
    tags: ["Networking", "Girişimcilik", "Sohbet"],
  },

  // OFFLINE ETKİNLİKLER
  {
    id: "event-007",
    title: "İstanbul Espor Zirvesi 2026",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.CONFERENCE,
    organizer: {
      id: "org-007",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "İstanbul",
      venue: "İstanbul Kongre Merkezi",
      isOnline: false,
    },
    startDate: "2026-04-15T09:00:00Z",
    currentParticipants: 650,
    maxParticipants: 2000,
    tags: ["Konferans", "Zirve", "İstanbul"],
  },
  {
    id: "event-008",
    title: "Ankara Espor Topluluk Buluşması",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.MEETUP,
    organizer: {
      id: "org-008",
      name: "Ankara Espor Topluluğu",
      logoUrl: null,
      type: "community",
    },
    location: {
      city: "Ankara",
      venue: "Kızılay Espor Cafe",
      isOnline: false,
    },
    startDate: "2026-02-22T15:00:00Z",
    currentParticipants: 45,
    maxParticipants: 80,
    tags: ["Buluşma", "Ankara", "Topluluk"],
  },
  {
    id: "event-009",
    title: "İzmir Gamer Meetup",
    imageUrl: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=800",
    status: EVENT_STATUS.UPCOMING,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.MEETUP,
    organizer: {
      id: "org-009",
      name: "İzmir Gaming Community",
      logoUrl: null,
      type: "community",
    },
    location: {
      city: "İzmir",
      venue: "Alsancak Game Center",
      isOnline: false,
    },
    startDate: "2026-03-08T14:00:00Z",
    currentParticipants: 32,
    maxParticipants: 60,
    tags: ["Meetup", "İzmir", "Gaming"],
  },
  {
    id: "event-010",
    title: "Espor Sektörü Panel Konuşması",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.PANEL,
    organizer: {
      id: "org-010",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "İstanbul",
      venue: "Boğaziçi Üniversitesi",
      isOnline: false,
    },
    startDate: "2026-02-28T13:00:00Z",
    currentParticipants: 120,
    maxParticipants: 200,
    tags: ["Panel", "Sektör", "Konuşma"],
  },
  {
    id: "event-011",
    title: "Çukurova Üniversitesi Espor Workshop",
    imageUrl: "https://images.unsplash.com/photo-1558742619-fd82741daa8a?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.WORKSHOP,
    organizer: {
      id: "org-011",
      name: "Çukurova Üniversitesi Espor Kulübü",
      logoUrl: null,
      type: "university",
    },
    location: {
      city: "Adana",
      venue: "Çukurova Üniversitesi Merkez Kampüs",
      isOnline: false,
    },
    startDate: "2026-02-18T10:00:00Z",
    currentParticipants: 38,
    maxParticipants: 50,
    tags: ["Workshop", "Üniversite", "Adana"],
  },
  {
    id: "event-012",
    title: "Bursa Gaming Night",
    imageUrl: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=800",
    status: EVENT_STATUS.UPCOMING,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.COMMUNITY,
    organizer: {
      id: "org-012",
      name: "Bursa Espor Topluluğu",
      logoUrl: null,
      type: "community",
    },
    location: {
      city: "Bursa",
      venue: "Nilüfer Espor Arena",
      isOnline: false,
    },
    startDate: "2026-03-15T19:00:00Z",
    currentParticipants: 56,
    maxParticipants: 100,
    tags: ["Gaming Night", "Bursa", "Sosyal"],
  },
  {
    id: "event-013",
    title: "Dokuz Eylül Üniversitesi - Espor Kariyer Günü",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
    status: EVENT_STATUS.REGISTRATION_OPEN,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.UNIVERSITY,
    organizer: {
      id: "org-013",
      name: "Dokuz Eylül Üniversitesi",
      logoUrl: null,
      type: "university",
    },
    location: {
      city: "İzmir",
      venue: "DEÜ Kongre Merkezi",
      isOnline: false,
    },
    startDate: "2026-03-01T10:00:00Z",
    currentParticipants: 180,
    maxParticipants: 300,
    tags: ["Kariyer", "Üniversite", "İzmir"],
  },
  {
    id: "event-014",
    title: "Worlds 2026 İzleme Partisi - İstanbul",
    imageUrl: "https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?q=80&w=800",
    status: EVENT_STATUS.UPCOMING,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.COMMUNITY,
    gameType: GAME_TYPE.LOL,
    organizer: {
      id: "org-014",
      name: "Optimi.gg",
      logoUrl: null,
      type: "optimi",
    },
    location: {
      city: "İstanbul",
      venue: "Optimi Arena",
      isOnline: false,
    },
    startDate: "2026-11-02T20:00:00Z",
    currentParticipants: 320,
    maxParticipants: 500,
    tags: ["Worlds", "İzleme Partisi", "LoL"],
  },
  {
    id: "event-015",
    title: "Hacettepe Espor Networking Gecesi",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
    status: EVENT_STATUS.COMPLETED,
    type: EVENT_TYPE.OFFLINE,
    category: EVENT_CATEGORY.NETWORKING,
    organizer: {
      id: "org-015",
      name: "Hacettepe Espor",
      logoUrl: null,
      type: "university",
    },
    location: {
      city: "Ankara",
      venue: "Hacettepe Üniversitesi",
      isOnline: false,
    },
    startDate: "2026-01-20T18:00:00Z",
    currentParticipants: 75,
    maxParticipants: 75,
    tags: ["Networking", "Üniversite", "Ankara"],
  },
];

/**
 * Etkinlik ID'sine göre etkinlik bilgisi döndürür
 */
export function getEventById(id: string): EventCardType | undefined {
  return mockEvents.find((e) => e.id === id);
}

/**
 * Etkinlik tipine göre etkinlikleri filtreler
 */
export function getEventsByType(type: string): EventCardType[] {
  if (type === "all") return mockEvents;
  return mockEvents.filter((e) => e.type === type);
}

/**
 * Etkinlik kategorisine göre etkinlikleri filtreler
 */
export function getEventsByCategory(category: string): EventCardType[] {
  if (category === "all") return mockEvents;
  return mockEvents.filter((e) => e.category === category);
}

/**
 * Aktif (kayıt açık veya canlı) etkinlikleri döndürür
 */
export function getActiveEvents(): EventCardType[] {
  return mockEvents.filter(
    (e) =>
      e.status === EVENT_STATUS.REGISTRATION_OPEN ||
      e.status === EVENT_STATUS.LIVE ||
      e.status === EVENT_STATUS.UPCOMING
  );
}
