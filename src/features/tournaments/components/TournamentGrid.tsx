"use client";

import * as React from "react";
import { Trophy } from "lucide-react";
import { TournamentCard } from "./TournamentCard";
import { TournamentCard as TournamentCardType, TournamentFilters } from "../types";
import { cn } from "@/lib/utils";

interface TournamentGridProps {
  tournaments: TournamentCardType[];
  filters?: TournamentFilters;
  isLoading?: boolean;
  className?: string;
}

// Skeleton Kart
function TournamentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-optimi-surface border border-border/50">
      {/* Görsel Skeleton */}
      <div className="aspect-[16/10] bg-muted animate-shimmer" />

      {/* İçerik Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-muted rounded animate-shimmer" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-shimmer" />
          <div className="h-3 w-24 bg-muted rounded animate-shimmer" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="h-3 w-20 bg-muted rounded animate-shimmer" />
          <div className="h-1.5 w-20 bg-muted rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Boş durum
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Trophy className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Turnuva Bulunamadı
      </h3>
      <p className="text-muted-foreground max-w-md">
        Aradığınız kriterlere uygun turnuva bulunamadı. Filtreleri değiştirmeyi
        veya daha sonra tekrar kontrol etmeyi deneyin.
      </p>
    </div>
  );
}

export function TournamentGrid({
  tournaments,
  isLoading = false,
  className,
}: TournamentGridProps) {
  // Loading durumu
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <TournamentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Boş durum
  if (tournaments.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
