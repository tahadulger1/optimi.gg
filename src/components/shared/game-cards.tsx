"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipe } from "@/hooks";

interface GameCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  gradient: string;
  textColor?: string;
}

const games: GameCard[] = [
  {
    id: "lol",
    name: "LEAGUE OF LEGENDS",
    slug: "league-of-legends",
    image: "/img/games/lol.jpg",
    gradient: "from-blue-900/90 to-blue-600/50",
    textColor: "text-blue-300",
  },
  {
    id: "valorant",
    name: "VALORANT",
    slug: "valorant",
    image: "/img/games/valorant.jpg",
    gradient: "from-red-900/90 to-red-600/50",
    textColor: "text-red-300",
  },
  {
    id: "tft",
    name: "TEAMFIGHT TACTICS",
    slug: "tft",
    image: "/img/games/tft.jpg",
    gradient: "from-purple-900/90 to-purple-600/50",
    textColor: "text-purple-300",
  },
  {
    id: "wildrift",
    name: "LEAGUE OF LEGENDS: WILD RIFT",
    slug: "wild-rift",
    image: "/img/games/wildrift.jpg",
    gradient: "from-cyan-900/90 to-cyan-600/50",
    textColor: "text-cyan-300",
  },
  {
    id: "warrock",
    name: "WARROCK",
    slug: "warrock",
    image: "/img/games/warrock.jpg",
    gradient: "from-green-900/90 to-green-600/50",
    textColor: "text-green-300",
  },
];

export function GameCards() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Swipe desteği
  useSwipe(scrollContainerRef, {
    onSwipeLeft: () => scrollToIndex(activeIndex + 1),
    onSwipeRight: () => scrollToIndex(activeIndex - 1),
  }, {
    threshold: 30,
    preventVertical: true,
  });

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, games.length - 1));
    if (!scrollContainerRef.current) return;
    
    const card = scrollContainerRef.current.children[newIndex] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  };

  const checkScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Aktif kartı hesapla
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 180;
    const newIndex = Math.round(scrollLeft / (cardWidth + 16));
    setActiveIndex(Math.min(newIndex, games.length - 1));
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    el.addEventListener("scroll", handleScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [checkScroll]);

  return (
    <section className="py-6 md:py-8 bg-optimi-darker section-optimized">
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Oyunlar</h2>
          
          {/* Desktop Navigation Buttons */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={!canScrollLeft}
              className={cn(
                "p-2 rounded-full transition-all",
                canScrollLeft 
                  ? "bg-optimi-surface text-foreground hover:bg-primary/20" 
                  : "bg-optimi-surface/50 text-muted-foreground/30 cursor-not-allowed"
              )}
              aria-label="Önceki oyun"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={!canScrollRight}
              className={cn(
                "p-2 rounded-full transition-all",
                canScrollRight 
                  ? "bg-optimi-surface text-foreground hover:bg-primary/20" 
                  : "bg-optimi-surface/50 text-muted-foreground/30 cursor-not-allowed"
              )}
              aria-label="Sonraki oyun"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-container",
            "snap-x snap-mandatory",
            "-mx-4 px-4" // Full bleed on mobile
          )}
          style={{ 
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch", // iOS momentum scroll
            scrollBehavior: "smooth",
            overscrollBehaviorX: "contain",
          }}
        >
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={`/oyunlar/${game.slug}`}
              className="flex-shrink-0 snap-start"
            >
              <div
                className={cn(
                  "relative rounded-xl overflow-hidden",
                  // Responsive sizing - mobilde daha büyük touch hedefi
                  "w-[160px] h-[200px] sm:w-[180px] sm:h-[220px] md:w-[200px] md:h-[250px]",
                  "group cursor-pointer card-optimized",
                  "hover:scale-[1.03] active:scale-[0.98]", // Touch feedback
                  // Aktif kart vurgusu
                  index === activeIndex && "ring-2 ring-primary/50"
                )}
              >
                {/* Gradient Background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t",
                    game.gradient
                  )}
                />
                
                {/* Darker overlay at bottom for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Game Name */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3
                    className={cn(
                      "text-xs sm:text-sm md:text-base font-bold leading-tight",
                      game.textColor || "text-white"
                    )}
                  >
                    {game.name}
                  </h3>
                </div>

                {/* Hover/Active Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 group-active:bg-white/10 transition-colors duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
          {games.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => scrollToIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                // Mobilde daha büyük touch alanı ama görsel olarak küçük
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
                idx === activeIndex
                  ? "bg-primary"
                  : "bg-white/20"
              )}
              aria-label={`${game.name} oyununa git`}
            >
              <span 
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  idx === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/30"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
