"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, Users, Trophy, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type TournamentCard as TournamentCardType } from "@/types";
import {
  mockTournaments,
  TOURNAMENT_STATUS_LABELS,
  GAME_TYPE_LABELS,
  FEATURED_TOURNAMENT_ID,
  formatTurkishDate,
  formatPrize,
} from "@/constants";
import { useSwipe } from "@/hooks";

interface TournamentCardProps {
  tournament: TournamentCardType;
  featured?: boolean;
}

function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const statusLabel = TOURNAMENT_STATUS_LABELS[tournament.status];
  const gameLabel = GAME_TYPE_LABELS[tournament.gameType];
  const participantPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  const formattedDate = formatTurkishDate(tournament.startDate);
  const formattedPrize = formatPrize(tournament.prizePool.total, tournament.prizePool.currency);

  if (featured) {
    return (
      <Link href={`/turnuvalar/${tournament.id}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden bg-optimi-surface border border-optimi-border card-optimized hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
          {/* Image Container */}
          <div className="relative h-[300px] md:h-[350px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-optimi-darker via-optimi-darker/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-optimi-dark to-optimi-darker gpu-layer transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
                statusLabel.className
              )}>
                {statusLabel.text}
              </span>
            </div>

            {/* Game Badge - Appears on Hover */}
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="px-3 py-1 text-xs font-medium rounded-md bg-black/90 text-white/90">
                {gameLabel}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-20 p-5 sm:p-6 -mt-16 sm:-mt-20 md:-mt-24">
            <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
              {tournament.title}
            </h3>
            
            {/* Info Items (mobilde sabit layout; hover efektleri sadece hover destekleyen cihazlarda) */}
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground mb-4 sm:flex sm:flex-wrap sm:gap-4">
              <div className="flex items-center gap-1.5 transition-all duration-300 md:group-hover:scale-110 md:group-hover:text-foreground">
                <CalendarDays className="h-4 w-4 transition-colors md:group-hover:text-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 transition-all duration-300 md:group-hover:scale-110 md:group-hover:text-foreground">
                <Users className="h-4 w-4 transition-colors md:group-hover:text-primary" />
                <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
              <div className="flex items-center gap-1.5 transition-all duration-300 md:group-hover:scale-110">
                <Trophy className="h-4 w-4 text-primary transition-transform md:group-hover:rotate-12" />
                <span className="text-primary font-bold text-base md:group-hover:text-lg transition-all duration-300">
                  {formattedPrize}
                </span>
              </div>
            </div>

            {/* Participant Progress Bar - Appears on Hover */}
            <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Katılımcı Durumu</span>
                <span className="text-primary">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
              <div className="h-1.5 bg-optimi-darker rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all duration-700 group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                  style={{ width: `${participantPercentage}%` }}
                />
              </div>
            </div>

            <Button variant="gold" className="w-full md:w-auto transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
              Turnuvaya Git
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/turnuvalar/${tournament.id}`} className="block group">
      <div className="relative rounded-xl overflow-hidden bg-optimi-surface border border-optimi-border card-optimized hover:border-primary/50 h-full hover:shadow-lg hover:shadow-black/20">
        {/* Image Container */}
        <div className="relative h-[160px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-optimi-surface to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-optimi-dark to-optimi-darker gpu-layer transition-transform duration-300 ease-out group-hover:scale-105" />
          
          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 via-transparent to-transparent z-[5]" />
          
          {/* Status Badge with Animation */}
          <div className="absolute top-3 left-3 z-20">
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded transition-all duration-300 group-hover:scale-110 group-hover:px-2.5 group-hover:py-1",
              statusLabel.className
            )}>
              {statusLabel.text}
            </span>
          </div>

          {/* Prize Badge with Scale Animation */}
          <div className="absolute bottom-3 right-3 z-20 transition-transform duration-200 group-hover:scale-110">
            <span className="px-2 py-1 text-xs font-bold rounded bg-black/90 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              {formattedPrize}
            </span>
          </div>

          {/* Game Tag - Appears on Hover */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-black/80 text-white/80">
              {gameLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 transition-all duration-300 group-hover:pb-5">
          {/* Date with Icon Animation */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 transition-all duration-300 group-hover:text-foreground/80">
            <CalendarDays className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            <span className="transition-all duration-300 group-hover:font-medium">{formattedDate}</span>
          </div>
          
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {tournament.title}
          </h3>

          {/* Additional Info - Expands on Hover */}
          <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-20 group-hover:mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-optimi-border/50 pt-3">
              <div className="flex items-center gap-1 transition-all duration-300 hover:scale-105">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
              <div className="flex items-center gap-1 transition-all duration-300 hover:scale-105">
                <Trophy className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="font-semibold text-primary">{formattedPrize}</span>
              </div>
            </div>
            {/* Mini Progress Bar */}
            <div className="mt-2 h-1 bg-optimi-darker rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700"
                style={{ width: `${participantPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Mobil swipeable carousel bileşeni
function MobileCarousel({ 
  tournaments, 
  title 
}: { 
  tournaments: TournamentCardType[]; 
  title?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const isScrolling = React.useRef(false);

  // Belirli bir index'e scroll yap
  const scrollToIndex = React.useCallback((index: number) => {
    if (!scrollRef.current || isScrolling.current) return;
    
    const children = scrollRef.current.children;
    if (index < 0 || index >= children.length) return;
    
    const targetCard = children[index] as HTMLElement;
    if (!targetCard) return;

    isScrolling.current = true;
    
    // scrollIntoView yerine manuel scroll kullanıyoruz (daha kontrollü)
    const containerLeft = scrollRef.current.getBoundingClientRect().left;
    const cardLeft = targetCard.getBoundingClientRect().left;
    const scrollOffset = cardLeft - containerLeft + scrollRef.current.scrollLeft - 16; // 16px padding için

    scrollRef.current.scrollTo({
      left: scrollOffset,
      behavior: "smooth",
    });

    // Scroll tamamlandıktan sonra flag'i kaldır
    setTimeout(() => {
      isScrolling.current = false;
    }, 350);

    setCurrentIndex(index);
  }, []);

  // Ok butonları ile kaydırma
  const handleNavClick = React.useCallback((direction: number) => {
    const newIndex = Math.max(0, Math.min(tournaments.length - 1, currentIndex + direction));
    scrollToIndex(newIndex);
  }, [currentIndex, tournaments.length, scrollToIndex]);

  // Swipe desteği - snap olmadan manuel kontrol
  useSwipe(scrollRef, {
    onSwipeLeft: () => handleNavClick(1),
    onSwipeRight: () => handleNavClick(-1),
  }, {
    threshold: 50,
    preventVertical: true,
  });

  // Scroll durumunu kontrol et
  const checkScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Mevcut index'i scroll pozisyonundan hesapla
    if (!isScrolling.current) {
      const children = scrollRef.current.children;
      const containerLeft = scrollRef.current.getBoundingClientRect().left;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const childLeft = child.getBoundingClientRect().left;
        if (childLeft >= containerLeft - 50) {
          setCurrentIndex(i);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        // requestAnimationFrame ile throttle - 60fps için optimize
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    el.addEventListener("scroll", handleScroll, { passive: true });
    checkScroll();
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [checkScroll]);

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleNavClick(-1)}
              disabled={!canScrollLeft}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-full transition-all touch-manipulation",
                canScrollLeft 
                  ? "bg-optimi-surface text-foreground hover:bg-primary/20 active:scale-95" 
                  : "bg-optimi-surface/50 text-muted-foreground/30"
              )}
              aria-label="Önceki"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleNavClick(1)}
              disabled={!canScrollRight}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-full transition-all touch-manipulation",
                canScrollRight 
                  ? "bg-optimi-surface text-foreground hover:bg-primary/20 active:scale-95" 
                  : "bg-optimi-surface/50 text-muted-foreground/30"
              )}
              aria-label="Sonraki"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 scroll-container"
        style={{ 
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
        }}
      >
        {tournaments.map((tournament) => (
          <div 
            key={tournament.id} 
            className="flex-shrink-0 w-[280px] sm:w-[320px]"
          >
            <TournamentCard tournament={tournament} />
          </div>
        ))}
      </div>
      {/* Swipe ipucu */}
      <p className="text-center text-xs text-muted-foreground/50 mt-2 sm:hidden">
        ← Kaydırın →
      </p>
    </div>
  );
}

export function TournamentSection() {
  // Mock datadan turnuvaları al
  const tournaments = mockTournaments;
  
  // Öne çıkan turnuvayı bul
  const featuredTournament = tournaments.find((t) => t.id === FEATURED_TOURNAMENT_ID);
  
  // Diğer turnuvaları filtrele
  const regularTournaments = tournaments.filter((t) => t.id !== FEATURED_TOURNAMENT_ID);
  
  // Grid düzeni için turnuvaları böl
  const leftColumn = regularTournaments.slice(0, 2);
  const rightColumn = regularTournaments.slice(2, 4);
  const bottomRow = regularTournaments.slice(4, 8);
  
  // Mobil carousel için turnuvaları birleştir
  const mobileCarouselTournaments = [...leftColumn, ...rightColumn];

  return (
    <section className="py-12 md:py-16 bg-optimi-darker section-optimized">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Öne Çıkan Turnuvalar</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Turnuvalar</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            En popüler turnuvalara katılarak rakiplerinle yarış ve
            ödüller kazanmak için kayıt ol.
          </p>
        </div>

        {/* Featured Tournament - Her ekran boyutunda */}
        <div className="mb-6 md:mb-8">
          {featuredTournament && (
            <TournamentCard tournament={featuredTournament} featured />
          )}
        </div>

        {/* Mobil: Swipeable Carousel */}
        <div className="lg:hidden mb-6">
          <MobileCarousel 
            tournaments={mobileCarouselTournaments} 
            title="Diğer Turnuvalar"
          />
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-8">
          {/* Tüm regular turnuvaları göster */}
          {regularTournaments.slice(0, 4).map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>

        {/* Bottom Row - Tablet ve üstü */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {bottomRow.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>

        {/* Mobil: Bottom Row Carousel */}
        <div className="sm:hidden mb-6">
          <MobileCarousel 
            tournaments={bottomRow} 
            title="Daha Fazla Turnuva"
          />
        </div>

        {/* View All Link */}
        <div className="text-center sm:text-right">
          <Link
            href="/turnuvalar"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] px-4"
          >
            Tüm Turnuvaları Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
