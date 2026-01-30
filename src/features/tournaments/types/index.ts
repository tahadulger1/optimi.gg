// Turnuvalar için TypeScript tip tanımlamaları

import { GameType, TournamentStatus, TournamentType, TournamentCard } from "@/types";

/**
 * Turnuva filtreleme parametreleri
 */
export interface TournamentFilters {
  type?: TournamentType | "all";
  gameType?: GameType | "all";
  status?: TournamentStatus | "all";
  search?: string;
}

// Re-export types from global types
export type { TournamentCard, TournamentType, TournamentStatus, GameType };
export { TOURNAMENT_STATUS, TOURNAMENT_TYPE, GAME_TYPE } from "@/types";
