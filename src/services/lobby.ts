import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Lobby, type GameType } from "@/types";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { sanitizeInput } from "@/lib/security";

// ============================================================================
// Types
// ============================================================================

export interface LobbyFiltersState {
  gameType: GameType | "all";
  minRank: number;
  maxRank: number;
  showFullLobbies: boolean;
  showPasswordProtected: boolean;
}

interface FetchLobbiesParams {
  filters?: Partial<LobbyFiltersState>;
  search?: string;
  page?: number;
  limit?: number;
}

interface LobbyApiResponse {
  data?: Lobby[];
}

interface SingleLobbyApiResponse {
  data?: Lobby;
}

// ============================================================================
// API Functions (Güvenli API Client ile)
// ============================================================================

/**
 * Lobileri API'den çeker
 * Güvenlik: CSRF koruması ve rate limiting dahil
 */
async function fetchLobbies(params?: FetchLobbiesParams): Promise<Lobby[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.filters?.gameType && params.filters.gameType !== "all") {
    searchParams.set("gameType", params.filters.gameType);
  }
  if (params?.search) {
    // Güvenlik: Arama terimini sanitize et
    const sanitizedSearch = sanitizeInput(params.search, 100);
    searchParams.set("search", sanitizedSearch);
  }
  if (params?.page) {
    searchParams.set("page", params.page.toString());
  }
  if (params?.limit) {
    // Güvenlik: Limit değerini sınırla
    const safeLimit = Math.min(Math.max(1, params.limit), 100);
    searchParams.set("limit", safeLimit.toString());
  }

  const endpoint = `/lobbies${searchParams.toString() ? `?${searchParams}` : ""}`;
  
  try {
    const data = await apiClient.get<Lobby[] | LobbyApiResponse>(endpoint);
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error("Lobiler yüklenirken bir hata oluştu");
  }
}

/**
 * Tek bir lobiyi ID ile çeker
 * Güvenlik: ID validasyonu dahil
 */
async function fetchLobbyById(lobbyId: string): Promise<Lobby> {
  // Güvenlik: Lobby ID'sini validate et (IDOR koruması)
  if (!lobbyId || typeof lobbyId !== "string" || lobbyId.length > 50) {
    throw new Error("Geçersiz lobi ID'si");
  }
  
  // ID'de tehlikeli karakterleri kontrol et
  if (!/^[a-zA-Z0-9_-]+$/.test(lobbyId)) {
    throw new Error("Geçersiz lobi ID formatı");
  }

  try {
    const data = await apiClient.get<Lobby | SingleLobbyApiResponse>(`/lobbies/${lobbyId}`);
    return "data" in data && data.data ? data.data : (data as Lobby);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error("Lobi bulunamadı");
      }
      if (error.statusCode === 403) {
        throw new Error("Bu lobiye erişim yetkiniz yok");
      }
      throw new Error(error.message);
    }
    throw new Error("Lobi yüklenirken bir hata oluştu");
  }
}

/**
 * Lobiye katılma isteği gönderir
 * Güvenlik: CSRF token ve yetki kontrolü dahil
 */
async function joinLobby(lobbyId: string, password?: string): Promise<void> {
  // Güvenlik: Lobby ID validasyonu
  if (!lobbyId || typeof lobbyId !== "string" || !/^[a-zA-Z0-9_-]+$/.test(lobbyId)) {
    throw new Error("Geçersiz lobi ID'si");
  }

  // Güvenlik: Şifreyi sanitize et (varsa)
  const sanitizedPassword = password ? sanitizeInput(password, 50) : undefined;

  try {
    await apiClient.post(`/lobbies/${lobbyId}/join`, { 
      password: sanitizedPassword 
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 403) {
        throw new Error("Bu lobiye katılma yetkiniz yok");
      }
      if (error.statusCode === 401) {
        throw new Error("Lobiye katılmak için giriş yapmalısınız");
      }
      if (error.statusCode === 400) {
        throw new Error("Lobi şifresi yanlış");
      }
      throw new Error(error.message);
    }
    throw new Error("Lobiye katılırken bir hata oluştu");
  }
}

// ============================================================================
// Query Keys
// ============================================================================

export const lobbyKeys = {
  all: ["lobbies"] as const,
  lists: () => [...lobbyKeys.all, "list"] as const,
  list: (filters?: FetchLobbiesParams) => [...lobbyKeys.lists(), filters] as const,
  details: () => [...lobbyKeys.all, "detail"] as const,
  detail: (id: string) => [...lobbyKeys.details(), id] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Lobileri çekmek için hook
 * @param params - Filtre, arama ve sayfalama parametreleri
 */
export function useLobbies(params?: FetchLobbiesParams) {
  return useQuery({
    queryKey: lobbyKeys.list(params),
    queryFn: () => fetchLobbies(params),
    staleTime: 30 * 1000, // 30 saniye fresh kal
    gcTime: 5 * 60 * 1000, // 5 dakika cache'de tut
    refetchInterval: 60 * 1000, // Her dakika otomatik yenile (aktif lobiler için)
  });
}

/**
 * Tek bir lobiyi çekmek için hook
 * @param lobbyId - Lobi ID'si
 */
export function useLobby(lobbyId: string) {
  return useQuery({
    queryKey: lobbyKeys.detail(lobbyId),
    queryFn: () => fetchLobbyById(lobbyId),
    enabled: !!lobbyId,
    staleTime: 10 * 1000, // 10 saniye fresh kal
  });
}

/**
 * Lobiye katılmak için mutation hook
 */
export function useJoinLobby() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lobbyId, password }: { lobbyId: string; password?: string }) =>
      joinLobby(lobbyId, password),
    onSuccess: () => {
      // Tüm lobi listelerini yenile
      queryClient.invalidateQueries({ queryKey: lobbyKeys.lists() });
    },
  });
}

/**
 * Lobi listesini manuel yenilemek için hook
 */
export function useRefreshLobbies() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: lobbyKeys.lists() });
  };
}
