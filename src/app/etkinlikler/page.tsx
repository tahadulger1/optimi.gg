"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header, Footer } from "@/components/shared";
import {
  EventHero,
  EventFilters,
  EventGrid,
  EventFiltersType,
  EVENT_TYPE,
  EVENT_CATEGORY,
  EVENT_STATUS,
} from "@/features/events";
import { mockEvents } from "@/constants/mockData";

export default function EtkinliklerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'den filtreleri al
  const initialFilters: EventFiltersType = {
    type: (searchParams.get("type") as EventFiltersType["type"]) || undefined,
    category:
      (searchParams.get("category") as EventFiltersType["category"]) ||
      undefined,
    gameType:
      (searchParams.get("game") as EventFiltersType["gameType"]) || undefined,
    search: searchParams.get("search") || undefined,
  };

  const [filters, setFilters] = React.useState<EventFiltersType>(initialFilters);

  // Filtreleri URL'e yansıt
  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);

    // URL güncelle
    const params = new URLSearchParams();
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.gameType) params.set("game", newFilters.gameType);
    if (newFilters.search) params.set("search", newFilters.search);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/etkinlikler", {
      scroll: false,
    });
  };

  // Etkinlikleri filtrele
  const filteredEvents = React.useMemo(() => {
    let result = [...mockEvents];

    // Tip filtresi
    if (filters.type && filters.type !== "all") {
      result = result.filter((event) => event.type === filters.type);
    }

    // Kategori filtresi
    if (filters.category && filters.category !== "all") {
      result = result.filter((event) => event.category === filters.category);
    }

    // Oyun filtresi
    if (filters.gameType && filters.gameType !== "all") {
      result = result.filter((event) => event.gameType === filters.gameType);
    }

    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.organizer.name.toLowerCase().includes(searchLower) ||
          event.location.city?.toLowerCase().includes(searchLower) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Aktif etkinlikleri öne al (kayıt açık > canlı > yaklaşıyor > diğer)
    const statusOrder: Record<string, number> = {
      [EVENT_STATUS.LIVE]: 0,
      [EVENT_STATUS.REGISTRATION_OPEN]: 1,
      [EVENT_STATUS.UPCOMING]: 2,
      [EVENT_STATUS.REGISTRATION_CLOSED]: 3,
      [EVENT_STATUS.COMPLETED]: 4,
      [EVENT_STATUS.CANCELLED]: 5,
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

      {/* Hero Banner - Tüm etkinlikler için */}
      <EventHero variant="all" />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* Başlık ve Filtreler */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Tüm Etkinlikler
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredEvents.length} etkinlik bulundu
              </p>
            </div>
          </div>

          {/* Filtreler */}
          <EventFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Etkinlik Grid'i */}
        <EventGrid events={filteredEvents} />

        {/* Bilgi Mesajı */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Filtrelere uygun etkinlik bulunmuyor.
            </p>
          </div>
        )}

        {/* Daha Fazla Yükle - Gelecekte pagination için */}
        {filteredEvents.length >= 12 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Tüm etkinlikler gösteriliyor
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
