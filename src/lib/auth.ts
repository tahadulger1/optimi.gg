import type { UserProfile, UserRank } from "@/types";

// Cookie adı
const AUTH_COOKIE_NAME = "optimi_auth";
const USER_COOKIE_NAME = "optimi_user";

/**
 * Demo kullanıcı bilgileri
 * NOT: Bu sadece development ortamında kullanılmalı.
 * Production'da bu değerler environment variable'lardan alınmalı
 * veya tamamen kaldırılmalıdır.
 */
const isDevelopment = process.env.NODE_ENV === "development";

export const DEMO_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || (isDevelopment ? "demo@optimi.gg" : ""),
  // GÜVENLİK: Password asla client-side bundle'da olmamalı
  // Bu sadece server-side validation için kullanılmalı
  password: "", // Password artık server-side'da kontrol edilecek
} as const;

/**
 * Demo login için server-side validation helper
 * Bu fonksiyon sadece development modunda çalışır
 */
export function validateDemoCredentials(email: string, password: string): boolean {
  if (!isDevelopment) {
    console.warn("Demo credentials sadece development ortamında kullanılabilir.");
    return false;
  }
  // Server-side'da environment variable'dan kontrol edilmeli
  const demoEmail = process.env.DEMO_EMAIL || "demo@optimi.gg";
  const demoPassword = process.env.DEMO_PASSWORD || "";
  
  return email === demoEmail && password === demoPassword;
}

// Mock kullanıcı verisi
export const MOCK_USER: UserProfile = {
  id: "user_123",
  username: "OptimiPlayer",
  email: "demo@optimi.gg",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=OptimiPlayer",
  profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=OptimiPlayer",
  rank: "gold" as UserRank,
  participatedTournamentIds: ["t1", "t2", "t3"],
  totalMatchesPlayed: 47,
  matchesWon: 28,
  bio: "Türkiye'nin en iyi espor platformunda yarışıyorum. Valorant ve LoL turnuvalarında aktif olarak yer alıyorum.",
  socialLinks: {
    discord: "OptimiPlayer#1234",
    twitter: "@optimiplayer",
    twitch: "optimiplayer",
  },
  createdAt: "2024-01-15T10:30:00Z",
};

// Rütbe bilgileri
export const RANK_INFO: Record<UserRank, { label: string; color: string; bgColor: string }> = {
  bronze: { label: "Bronz", color: "text-amber-700", bgColor: "bg-amber-700/20" },
  silver: { label: "Gümüş", color: "text-gray-400", bgColor: "bg-gray-400/20" },
  gold: { label: "Altın", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  platinum: { label: "Platin", color: "text-cyan-400", bgColor: "bg-cyan-400/20" },
  diamond: { label: "Elmas", color: "text-blue-400", bgColor: "bg-blue-400/20" },
  master: { label: "Master", color: "text-purple-500", bgColor: "bg-purple-500/20" },
  grandmaster: { label: "Grandmaster", color: "text-red-500", bgColor: "bg-red-500/20" },
};

/**
 * Cookie'den değer oku
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Cookie ayarla
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 * Cookie sil
 */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Kullanıcının giriş yapıp yapmadığını kontrol et
 */
export function isAuthenticated(): boolean {
  return getCookie(AUTH_COOKIE_NAME) === "true";
}

/**
 * Mock giriş yap
 */
export function mockLogin(): void {
  setCookie(AUTH_COOKIE_NAME, "true", 7);
  setCookie(USER_COOKIE_NAME, JSON.stringify(MOCK_USER), 7);
}

/**
 * Çıkış yap
 */
export function mockLogout(): void {
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie(USER_COOKIE_NAME);
}

/**
 * Mevcut kullanıcıyı al
 */
export function getCurrentUser(): UserProfile | null {
  if (!isAuthenticated()) return null;
  
  const userCookie = getCookie(USER_COOKIE_NAME);
  if (!userCookie) return MOCK_USER;
  
  try {
    return JSON.parse(decodeURIComponent(userCookie)) as UserProfile;
  } catch {
    return MOCK_USER;
  }
}

/**
 * Kullanıcı bilgilerini güncelle (mock)
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const currentUser = getCurrentUser() || MOCK_USER;
  const updatedUser = { ...currentUser, ...updates };
  setCookie(USER_COOKIE_NAME, JSON.stringify(updatedUser), 7);
  return updatedUser;
}
