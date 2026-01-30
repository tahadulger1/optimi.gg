import { Header, Footer } from "@/components/shared";
import { Globe, Users, Calendar } from "lucide-react";

// Skeleton Card
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

export default function OnlineTurnuvalarLoading() {
  return (
    <main className="min-h-screen bg-optimi-darker">
      {/* Header */}
      <Header />

      {/* Hero Skeleton */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted animate-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-b from-optimi-darker/60 via-optimi-darker/80 to-optimi-darker" />

        <div className="relative container mx-auto px-4 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge Skeleton */}
            <div className="h-10 w-48 bg-muted/50 rounded-full animate-shimmer" />

            {/* Title Skeleton */}
            <div className="h-14 w-80 bg-muted/50 rounded animate-shimmer" />

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-full max-w-xl bg-muted/30 rounded animate-shimmer" />
              <div className="h-5 w-3/4 max-w-lg bg-muted/30 rounded animate-shimmer" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6 md:gap-10 pt-4">
              {[Globe, Users, Calendar].map((Icon, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center animate-shimmer">
                    <Icon className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 w-16 bg-muted/30 rounded animate-shimmer" />
                    <div className="h-3 w-20 bg-muted/20 rounded animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="h-8 w-56 bg-muted rounded animate-shimmer" />
              <div className="h-4 w-40 bg-muted/50 rounded animate-shimmer" />
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="h-10 w-full max-w-md bg-muted/50 rounded-lg animate-shimmer" />
            <div className="h-10 w-28 bg-muted/50 rounded-lg animate-shimmer" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <TournamentCardSkeleton key={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
