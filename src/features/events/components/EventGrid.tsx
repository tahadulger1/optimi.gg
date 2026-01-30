"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { EventCard } from "./EventCard";
import { EventCard as EventCardType, EventFilters } from "../types";
import { cn } from "@/lib/utils";

interface EventGridProps {
  events: EventCardType[];
  filters?: EventFilters;
  isLoading?: boolean;
  className?: string;
}

// Skeleton Kart
function EventCardSkeleton() {
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
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-muted rounded animate-shimmer" />
          <div className="h-3 w-16 bg-muted rounded animate-shimmer" />
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
        <Calendar className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Etkinlik Bulunamadı
      </h3>
      <p className="text-muted-foreground max-w-md">
        Aradığınız kriterlere uygun etkinlik bulunamadı. Filtreleri değiştirmeyi
        veya daha sonra tekrar kontrol etmeyi deneyin.
      </p>
    </div>
  );
}

export function EventGrid({
  events,
  isLoading = false,
  className,
}: EventGridProps) {
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
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Boş durum
  if (events.length === 0) {
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
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
