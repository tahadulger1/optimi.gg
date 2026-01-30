"use client";

import * as React from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TournamentFilters as TournamentFiltersType,
  TOURNAMENT_TYPE,
  TOURNAMENT_STATUS,
  GAME_TYPE,
  TournamentType,
  TournamentStatus,
  GameType,
} from "../types";

interface TournamentFiltersProps {
  filters: TournamentFiltersType;
  onFiltersChange: (filters: TournamentFiltersType) => void;
  className?: string;
  hideTypeFilter?: boolean;
}

// Filtre buton tipi
interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// Tip filtre seçenekleri
const typeOptions: { value: TournamentType | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: TOURNAMENT_TYPE.ONLINE, label: "Online" },
  { value: TOURNAMENT_TYPE.OFFLINE, label: "Offline" },
];

// Durum filtre seçenekleri
const statusOptions: { value: TournamentStatus | "all"; label: string }[] = [
  { value: "all", label: "Tüm Durumlar" },
  { value: TOURNAMENT_STATUS.REGISTRATION_OPEN, label: "Kayıt Açık" },
  { value: TOURNAMENT_STATUS.IN_PROGRESS, label: "Devam Ediyor" },
  { value: TOURNAMENT_STATUS.UPCOMING, label: "Yakında" },
  { value: TOURNAMENT_STATUS.COMPLETED, label: "Tamamlandı" },
];

// Oyun filtre seçenekleri
const gameOptions: { value: GameType | "all"; label: string }[] = [
  { value: "all", label: "Tüm Oyunlar" },
  { value: GAME_TYPE.VALORANT, label: "VALORANT" },
  { value: GAME_TYPE.LOL, label: "League of Legends" },
  { value: GAME_TYPE.TFT, label: "TFT" },
  { value: GAME_TYPE.WILD_RIFT, label: "Wild Rift" },
  { value: GAME_TYPE.PUBG_MOBILE, label: "PUBG Mobile" },
  { value: GAME_TYPE.ROCKET_LEAGUE, label: "Rocket League" },
  { value: GAME_TYPE.FALL_GUYS, label: "Fall Guys" },
  { value: GAME_TYPE.HAXBALL, label: "Haxball" },
  { value: GAME_TYPE.WARROCK, label: "Warrock" },
];

export function TournamentFilters({
  filters,
  onFiltersChange,
  className,
  hideTypeFilter = false,
}: TournamentFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(filters.search || "");

  // Arama debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const handleTypeChange = (type: TournamentType | "all") => {
    onFiltersChange({
      ...filters,
      type: type === "all" ? undefined : type,
    });
  };

  const handleStatusChange = (status: TournamentStatus | "all") => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const handleGameChange = (gameType: GameType | "all") => {
    onFiltersChange({
      ...filters,
      gameType: gameType === "all" ? undefined : gameType,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.type || filters.status || filters.gameType || filters.search;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Ana Filtre Satırı */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Arama */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Turnuva ara..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tip Filtreleri - Mobilde yatay scroll */}
        {!hideTypeFilter && (
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {typeOptions.map((option) => (
              <FilterButton
                key={option.value}
                label={option.label}
                isActive={
                  option.value === "all"
                    ? !filters.type
                    : filters.type === option.value
                }
                onClick={() => handleTypeChange(option.value)}
              />
            ))}
          </div>
        )}

        {/* Gelişmiş Filtreler Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "gap-2 border-border/50",
            isExpanded && "bg-muted border-primary/50"
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtreler</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
          {hasActiveFilters && (
            <span className="h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </div>

      {/* Genişletilmiş Filtreler */}
      {isExpanded && (
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-4 animate-fade-in">
          {/* Durum Filtreleri */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Durum
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  label={option.label}
                  isActive={
                    option.value === "all"
                      ? !filters.status
                      : filters.status === option.value
                  }
                  onClick={() => handleStatusChange(option.value)}
                />
              ))}
            </div>
          </div>

          {/* Oyun Filtreleri */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Oyun
            </label>
            <div className="flex flex-wrap gap-2">
              {gameOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  label={option.label}
                  isActive={
                    option.value === "all"
                      ? !filters.gameType
                      : filters.gameType === option.value
                  }
                  onClick={() => handleGameChange(option.value)}
                />
              ))}
            </div>
          </div>

          {/* Filtreleri Temizle */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
