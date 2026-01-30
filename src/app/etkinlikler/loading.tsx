import { Header, Footer } from "@/components/shared";

// Skeleton Kart Bileşeni
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

export default function EtkinliklerLoading() {
  return (
    <main className="min-h-screen bg-optimi-darker">
      {/* Header */}
      <Header />

      {/* Hero Skeleton */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted animate-shimmer" />
        <div className="relative container mx-auto px-4 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge Skeleton */}
            <div className="h-10 w-40 bg-muted/50 rounded-full animate-shimmer" />

            {/* Title Skeleton */}
            <div className="h-14 w-64 bg-muted/50 rounded animate-shimmer" />

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-full max-w-xl bg-muted/50 rounded animate-shimmer" />
              <div className="h-5 w-3/4 max-w-md bg-muted/50 rounded animate-shimmer" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted/50 rounded-xl animate-shimmer" />
                  <div className="space-y-1">
                    <div className="h-6 w-12 bg-muted/50 rounded animate-shimmer" />
                    <div className="h-3 w-16 bg-muted/50 rounded animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded animate-shimmer" />
              <div className="h-4 w-32 bg-muted rounded animate-shimmer" />
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="h-10 w-full max-w-md bg-muted rounded-lg animate-shimmer" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-20 bg-muted rounded-lg animate-shimmer"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
