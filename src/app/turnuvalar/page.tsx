"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header, Footer } from "@/components/shared";
import {
  TournamentHero,
  TournamentFilters,
  TournamentGrid,
  TournamentFiltersType,
  TOURNAMENT_TYPE,
  TOURNAMENT_STATUS,
} from "@/features/tournaments";
import { mockTournaments } from "@/constants/mockData";

export default function TurnuvalarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'den filtreleri al
  const initialFilters: TournamentFiltersType = {
    type: (searchParams.get("type") as TournamentFiltersType["type"]) || undefined,
    gameType:
      (searchParams.get("game") as TournamentFiltersType["gameType"]) || undefined,
    status:
      (searchParams.get("status") as TournamentFiltersType["status"]) || undefined,
    search: searchParams.get("search") || undefined,
  };

  const [filters, setFilters] = React.useState<TournamentFiltersType>(initialFilters);

  // Filtreleri URL'e yansıt
  const handleFiltersChange = (newFilters: TournamentFiltersType) => {
    setFilters(newFilters);

    // URL güncelle
    const params = new URLSearchParams();
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.gameType) params.set("game", newFilters.gameType);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.search) params.set("search", newFilters.search);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/turnuvalar", {
      scroll: false,
    });
  };

  // Turnuvaları filtrele
  const filteredTournaments = React.useMemo(() => {
    let result = [...mockTournaments];

    // Tip filtresi
    if (filters.type && filters.type !== "all") {
      result = result.filter((tournament) => tournament.type === filters.type);
    }

    // Oyun filtresi
    if (filters.gameType && filters.gameType !== "all") {
      result = result.filter((tournament) => tournament.gameType === filters.gameType);
    }

    // Durum filtresi
    if (filters.status && filters.status !== "all") {
      result = result.filter((tournament) => tournament.status === filters.status);
    }

    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (tournament) =>
          tournament.title.toLowerCase().includes(searchLower) ||
          tournament.location?.city?.toLowerCase().includes(searchLower)
      );
    }

    // Aktif turnuvaları öne al (kayıt açık > devam ediyor > yaklaşıyor > diğer)
    const statusOrder: Record<string, number> = {
      [TOURNAMENT_STATUS.IN_PROGRESS]: 0,
      [TOURNAMENT_STATUS.REGISTRATION_OPEN]: 1,
      [TOURNAMENT_STATUS.UPCOMING]: 2,
      [TOURNAMENT_STATUS.REGISTRATION_CLOSED]: 3,
      [TOURNAMENT_STATUS.COMPLETED]: 4,
      [TOURNAMENT_STATUS.CANCELLED]: 5,
    };

    result.sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;
      if (orderA !== orderB) return orderA - orderB;

      // Aynı durumda olanları tarihe göre sırala
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    return result;
  }, [filters]);

  return (
    <main className="min-h-screen bg-optimi-darker">
      {/* Header */}
      <Header />

      {/* Hero Banner - Tüm turnuvalar için */}
      <TournamentHero variant="all" />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* Başlık ve Filtreler */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Tüm Turnuvalar
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredTournaments.length} turnuva bulundu
              </p>
            </div>
          </div>

          {/* Filtreler */}
          <TournamentFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Turnuva Grid'i */}
        <TournamentGrid tournaments={filteredTournaments} />

        {/* Bilgi Mesajı */}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Filtrelere uygun turnuva bulunmuyor.
            </p>
          </div>
        )}

        {/* Daha Fazla Yükle - Gelecekte pagination için */}
        {filteredTournaments.length >= 12 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Tüm turnuvalar gösteriliyor
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
