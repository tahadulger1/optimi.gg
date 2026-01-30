"use client";

import { useState, useMemo, useDeferredValue, useCallback } from "react";
import dynamic from "next/dynamic";
import { type Lobby, LOBBY_STATUS } from "@/types";
import { mockLobbies, USER_RANK_ORDER } from "@/constants/mockData";
import { LobbyCard } from "./LobbyCard";
import { LobbyFilters, DEFAULT_FILTERS, type LobbyFiltersState } from "./LobbyFilters";
import { Gamepad2, Search, Loader2, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Z_INDEX } from "@/lib/z-index";

// Dynamic import ile modal'ı lazy load et
// Bu sayede ilk yüklemede bundle size azalır
const LobbyDetailModal = dynamic(
  () => import("./LobbyDetailModal").then((mod) => ({ default: mod.LobbyDetailModal })),
  {
    loading: () => (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        style={{ zIndex: Z_INDEX.loading }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false, // Modal client-side only
  }
);

interface LobbyListProps {
  /** Dışarıdan lobi verisi geçilebilir, yoksa mock data kullanılır */
  lobbies?: Lobby[];
  /** Lobiye katılma callback'i */
  onJoinLobby?: (lobbyId: string) => void;
}

export function LobbyList({ lobbies = mockLobbies, onJoinLobby }: LobbyListProps) {
  // Filtre state'i
  const [filters, setFilters] = useState<LobbyFiltersState>(DEFAULT_FILTERS);
  // Arama state'i
  const [searchQuery, setSearchQuery] = useState("");
  // Modal state'i
  const [selectedLobby, setSelectedLobby] = useState<Lobby | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useDeferredValue ile arama sorgusunu geciktir
  // Bu sayede input hızlı kalır, filtreleme arka planda yapılır
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredFilters = useDeferredValue(filters);
  
  // Arama/filtreleme devam ederken gösterge için
  const isSearching = searchQuery !== deferredSearchQuery || filters !== deferredFilters;

  // Filtrelenmiş lobiler - deferredValue kullanır
  const filteredLobbies = useMemo(() => {
    return lobbies.filter((lobby) => {
      // Oyun filtresi
      if (deferredFilters.gameType !== "all" && lobby.gameType !== deferredFilters.gameType) {
        return false;
      }

      // Rütbe filtresi
      if (lobby.minRankRequired) {
        const lobbyRankOrder = USER_RANK_ORDER[lobby.minRankRequired];
        if (lobbyRankOrder < deferredFilters.minRank || lobbyRankOrder > deferredFilters.maxRank) {
          return false;
        }
      }

      // Dolu lobi filtresi
      if (!deferredFilters.showFullLobbies && lobby.availableSlots === 0) {
        return false;
      }

      // Şifreli lobi filtresi
      if (!deferredFilters.showPasswordProtected && lobby.isPasswordProtected) {
        return false;
      }

      // Arama filtresi
      if (deferredSearchQuery.trim()) {
        const query = deferredSearchQuery.toLowerCase();
        const matchesTitle = lobby.title.toLowerCase().includes(query);
        const matchesDescription = lobby.description?.toLowerCase().includes(query);
        const matchesCreator = lobby.creator.username.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription && !matchesCreator) {
          return false;
        }
      }

      return true;
    });
  }, [lobbies, deferredFilters, deferredSearchQuery]);

  // Aktif (bekleyen) lobileri üste al
  const sortedLobbies = useMemo(() => {
    return [...filteredLobbies].sort((a, b) => {
      // Önce bekleyen lobiler
      if (a.status === LOBBY_STATUS.WAITING && b.status !== LOBBY_STATUS.WAITING) return -1;
      if (a.status !== LOBBY_STATUS.WAITING && b.status === LOBBY_STATUS.WAITING) return 1;
      // Sonra boş yeri olanlara öncelik
      if (a.availableSlots > 0 && b.availableSlots === 0) return -1;
      if (a.availableSlots === 0 && b.availableSlots > 0) return 1;
      // En son güncellenenler önce
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filteredLobbies]);

  // Modal işlemleri - useCallback ile memoize edildi (performans optimizasyonu)
  const handleViewDetails = useCallback((lobby: Lobby) => {
    setSelectedLobby(lobby);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLobby(null);
  }, []);

  // Katılma işlemi - useCallback ile memoize edildi
  const handleJoin = useCallback((lobbyId: string) => {
    if (onJoinLobby) {
      onJoinLobby(lobbyId);
    } else {
      // Varsayılan davranış - alert ile bildirim
      alert(`"${lobbyId}" lobisine katılım isteği gönderildi!`);
    }
  }, [onJoinLobby]);

  // Filtre sıfırlama - useCallback ile memoize edildi
  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  }, []);

  // Aktif filtre sayısını hesapla (varsayılandan farklı olanlar)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.gameType !== DEFAULT_FILTERS.gameType) count++;
    if (filters.minRank !== DEFAULT_FILTERS.minRank) count++;
    if (filters.maxRank !== DEFAULT_FILTERS.maxRank) count++;
    if (filters.showFullLobbies !== DEFAULT_FILTERS.showFullLobbies) count++;
    if (filters.showPasswordProtected !== DEFAULT_FILTERS.showPasswordProtected) count++;
    return count;
  }, [filters]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sol Sidebar - Filtreler (sadece desktop) */}
      <aside className="hidden lg:block w-72 shrink-0">
        <LobbyFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />
      </aside>

      {/* Ana İçerik - Lobi Listesi */}
      <main className="flex-1 space-y-4">
        {/* Başlık ve Arama */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lobi Bul</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {sortedLobbies.length} aktif lobi bulundu
              </p>
            </div>

            {/* Mobil Filtre Butonu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="lg:hidden relative min-h-[44px] gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtreler</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <LobbyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={handleResetFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Arama Kutusu */}
          <div className="relative w-full sm:w-64 sm:self-end">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              type="text"
              placeholder="Lobi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 min-h-[44px]"
            />
          </div>
        </div>

        {/* Lobi Grid */}
        {sortedLobbies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedLobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={lobby}
                onJoin={handleJoin}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          // Boş durum
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Lobi Bulunamadı
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Arama kriterlerinize uygun lobi bulunamadı. Filtreleri değiştirmeyi
              veya yeni bir lobi oluşturmayı deneyin.
            </p>
          </div>
        )}
      </main>

      {/* Lobi Detay Modalı */}
      <LobbyDetailModal
        lobby={selectedLobby}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoin={handleJoin}
      />
    </div>
  );
}
