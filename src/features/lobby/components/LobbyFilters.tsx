"use client";

import { GAME_TYPE, USER_RANK, type GameType, type UserRank } from "@/types";
import { GAME_TYPE_LABELS, USER_RANK_LABELS, USER_RANK_ORDER } from "@/constants/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, RotateCcw } from "lucide-react";

// Oyun seçenekleri
const GAME_OPTIONS = [
  { value: "all", label: "Tüm Oyunlar" },
  { value: GAME_TYPE.VALORANT, label: GAME_TYPE_LABELS[GAME_TYPE.VALORANT] },
  { value: GAME_TYPE.LOL, label: GAME_TYPE_LABELS[GAME_TYPE.LOL] },
  { value: GAME_TYPE.TFT, label: GAME_TYPE_LABELS[GAME_TYPE.TFT] },
  { value: GAME_TYPE.WILD_RIFT, label: GAME_TYPE_LABELS[GAME_TYPE.WILD_RIFT] },
  { value: GAME_TYPE.PUBG_MOBILE, label: GAME_TYPE_LABELS[GAME_TYPE.PUBG_MOBILE] },
  { value: GAME_TYPE.ROCKET_LEAGUE, label: GAME_TYPE_LABELS[GAME_TYPE.ROCKET_LEAGUE] },
];

// Rütbe seçenekleri (slider için)
const RANK_VALUES = Object.values(USER_RANK);
const RANK_MIN = 1;
const RANK_MAX = 7;

export interface LobbyFiltersState {
  gameType: GameType | "all";
  minRank: number;
  maxRank: number;
  showFullLobbies: boolean;
  showPasswordProtected: boolean;
}

interface LobbyFiltersProps {
  filters: LobbyFiltersState;
  onFiltersChange: (filters: LobbyFiltersState) => void;
  onReset: () => void;
}

/**
 * Rütbe değerinden rütbe tipine çevirir
 */
function getRankFromValue(value: number): UserRank {
  const ranks = Object.entries(USER_RANK_ORDER).find(([_, v]) => v === value);
  return ranks ? (ranks[0] as UserRank) : USER_RANK.BRONZE;
}

/**
 * Rütbe etiketini döndürür
 */
function getRankLabel(value: number): string {
  const rank = getRankFromValue(value);
  return USER_RANK_LABELS[rank].text;
}

export function LobbyFilters({ filters, onFiltersChange, onReset }: LobbyFiltersProps) {
  const handleGameChange = (value: string) => {
    onFiltersChange({
      ...filters,
      gameType: value as GameType | "all",
    });
  };

  const handleRankChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minRank: values[0],
      maxRank: values[1],
    });
  };

  const handleShowFullLobbiesChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      showFullLobbies: checked,
    });
  };

  const handleShowPasswordProtectedChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      showPasswordProtected: checked,
    });
  };

  return (
    <Card className="lg:sticky lg:top-24 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Filtreler
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Sıfırla
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Oyun Seçimi */}
        <div className="space-y-2">
          <Label htmlFor="game-select" className="text-sm font-medium">
            Oyun
          </Label>
          <Select value={filters.gameType} onValueChange={handleGameChange}>
            <SelectTrigger id="game-select" className="w-full">
              <SelectValue placeholder="Oyun seçin" />
            </SelectTrigger>
            <SelectContent>
              {GAME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rütbe Aralığı */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Rütbe Aralığı</Label>
          <div className="px-2">
            <Slider
              value={[filters.minRank, filters.maxRank]}
              onValueChange={handleRankChange}
              min={RANK_MIN}
              max={RANK_MAX}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-secondary/50">
              {getRankLabel(filters.minRank)}
            </span>
            <span className="text-muted-foreground">—</span>
            <span className="px-2 py-1 rounded bg-secondary/50">
              {getRankLabel(filters.maxRank)}
            </span>
          </div>
        </div>

        {/* Ek Filtreler */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Diğer Seçenekler</Label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-full"
              checked={filters.showFullLobbies}
              onCheckedChange={handleShowFullLobbiesChange}
            />
            <label
              htmlFor="show-full"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Dolu lobileri göster
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-password"
              checked={filters.showPasswordProtected}
              onCheckedChange={handleShowPasswordProtectedChange}
            />
            <label
              htmlFor="show-password"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Şifreli lobileri göster
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Varsayılan filtre değerleri
 */
export const DEFAULT_FILTERS: LobbyFiltersState = {
  gameType: "all",
  minRank: RANK_MIN,
  maxRank: RANK_MAX,
  showFullLobbies: true,
  showPasswordProtected: true,
};
