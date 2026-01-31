"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSwipe } from "@/hooks";

interface GameCard {
  id: string;
  name: string;
  slug: string;
  image: string;
}

const games: GameCard[] = [
  {
    id: "lol",
    name: "LEAGUE OF LEGENDS",
    slug: "league-of-legends",
    image: "/img/lol_card.jpg",
  },
  {
    id: "valorant",
    name: "VALORANT",
    slug: "valorant",
    image: "/img/valorant_card.webp",
  },
  {
    id: "tft",
    name: "TEAMFIGHT TACTICS",
    slug: "tft",
    image: "/img/tft_card.webp",
  },
  {
    id: "wildrift",
    name: "LEAGUE OF LEGENDS: WILD RIFT",
    slug: "wild-rift",
    image: "/img/wildrift_card.webp",
  },
  {
    id: "warrock",
    name: "WARROCK",
    slug: "warrock",
    image: "/img/warrock2_card.webp",
  },
];

export function GameCards() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const getApproxIndex = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return 0;

    const cardWidth = el.firstElementChild?.clientWidth || 200;
    // Tailwind gap-3/gap-4 -> yaklaşık 12-16px
    const gap = window.matchMedia("(min-width: 768px)").matches ? 16 : 12;
    return Math.round(el.scrollLeft / (cardWidth + gap));
  }, []);

  // Swipe desteği
  useSwipe(
    scrollContainerRef,
    {
      onSwipeLeft: () => scrollToIndex(getApproxIndex() + 1),
      onSwipeRight: () => scrollToIndex(getApproxIndex() - 1),
    },
    {
      threshold: 30,
      preventVertical: true,
    }
  );

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, games.length - 1));
    if (!scrollContainerRef.current) return;
    
    const card = scrollContainerRef.current.children[newIndex] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  };

  return (
    <section className="py-6 md:py-8 bg-optimi-darker section-optimized">
      <div className="container mx-auto px-4">
        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-3 md:gap-4 pb-4 scrollbar-hide scroll-container",
            // Mobilde yatay kaydırma, desktop'ta ortalı + wrap
            "overflow-x-auto sm:overflow-x-visible sm:flex-wrap sm:justify-center",
            "-mx-4 px-4 sm:mx-0 sm:px-0" // Full bleed only on mobile
          )}
          style={{ 
            WebkitOverflowScrolling: "touch", // iOS momentum scroll
            scrollBehavior: "smooth",
            overscrollBehaviorX: "contain",
          }}
        >
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={`/oyunlar/${game.slug}`}
              className="flex-shrink-0"
            >
              <div
                className={cn(
                  "relative rounded-xl overflow-hidden",
                  // Responsive sizing - mobilde daha büyük touch hedefi
                  "w-[210px] h-[270px] sm:w-[250px] sm:h-[320px] md:w-[280px] md:h-[360px]",
                  "group cursor-pointer card-optimized",
                  "hover:scale-[1.03] active:scale-[0.98]" // Touch feedback
                )}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={game.image}
                    alt={`${game.name} kart görseli`}
                    fill
                    sizes="(min-width: 768px) 280px, (min-width: 640px) 250px, 210px"
                    quality={95}
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out",
                      "group-hover:scale-110",
                      // Görseli ön plana çıkar (renk overlay yerine)
                      "group-hover:saturate-[1.08] group-hover:contrast-[1.06]"
                    )}
                    priority={index < 2}
                  />
                </div>

                {/* Minimal overlay (görseli boğmadan kontrastı toparlar) */}
                <div className="absolute inset-0 bg-black/15" />
                
                {/* Darker overlay at bottom for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                {/* Game Name */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3
                    className={cn(
                      "text-xs sm:text-sm md:text-base font-bold leading-tight tracking-wide text-white",
                      "drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
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
      </div>
    </section>
  );
}
