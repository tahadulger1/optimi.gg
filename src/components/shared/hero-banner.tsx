"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mockHeroBanners, type HeroBannerSlide } from "@/constants";
import { useSwipe } from "@/hooks";
import { Z_INDEX } from "@/lib/z-index";

interface HeroBannerProps {
  /** Özel banner verileri (opsiyonel, varsayılan mockHeroBanners kullanılır) */
  banners?: HeroBannerSlide[];
  /** Otomatik geçiş süresi (ms) */
  autoPlayInterval?: number;
}

export function HeroBanner({ 
  banners = mockHeroBanners, 
  autoPlayInterval = 5000 
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const containerRef = React.useRef<HTMLElement>(null);

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Swipe gesture desteği
  const { state: swipeState } = useSwipe(containerRef, {
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    onSwipeMove: (deltaX) => {
      // Swipe sırasında visual feedback
      setSwipeOffset(deltaX * 0.3); // Azaltılmış hareket
    },
    onSwipeEnd: () => {
      setSwipeOffset(0);
    },
  }, {
    threshold: 50,
    preventVertical: true,
    preventDefault: true,
  });

  // Swipe bittiğinde offset'i sıfırla
  React.useEffect(() => {
    if (!swipeState.isSwiping) {
      setSwipeOffset(0);
    }
  }, [swipeState.isSwiping]);

  // Auto-slide (hover durumunda duraklat)
  React.useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isHovered]);

  // Klavye navigasyonu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden touch-pan-y select-none contain-paint"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Öne çıkan turnuvalar"
    >
      {/* Slides */}
      {banners.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 gpu-layer",
            // Sadece gerekli transition'lar - transform ve opacity
            swipeState.isSwiping 
              ? "transition-none" 
              : "transition-[opacity,transform] duration-500 ease-out",
            index === currentSlide 
              ? "opacity-100" 
              : "opacity-0 pointer-events-none"
          )}
          style={{
            transform: index === currentSlide 
              ? `translate3d(${swipeOffset}px, 0, 0) scale(1)` 
              : "translate3d(0, 0, 0) scale(1.02)",
          }}
          aria-hidden={index !== currentSlide}
        >
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-optimi-darker via-optimi-darker/50 to-transparent" style={{ zIndex: Z_INDEX.base + 10 }} />
          
          {/* Dynamic Gradient Background based on slide */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br to-optimi-darker",
            slide.gradient
          )} />
          
          {/* Placeholder background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center" style={{ zIndex: Z_INDEX.base + 20 }}>
            <div className="max-w-2xl">
              {/* Title with animation */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 animate-in fade-in slide-in-from-left-5 duration-500">
                <span className="text-white">{slide.title}</span>
              </h1>
              
              {/* Subtitle */}
              {slide.subtitle && (
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary animate-in fade-in slide-in-from-left-5 duration-700 delay-100">
                  {slide.subtitle}
                </h2>
              )}

              {/* Description */}
              {slide.description && (
                <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-lg animate-in fade-in slide-in-from-left-5 duration-700 delay-200">
                  {slide.description}
                </p>
              )}

              {/* CTA Button */}
              {slide.ctaText && slide.ctaLink && (
                <div className="mt-6 animate-in fade-in slide-in-from-left-5 duration-700 delay-300">
                  <Button
                    variant="gold"
                    size="lg"
                    asChild
                    className="group"
                  >
                    <Link href={slide.ctaLink}>
                      {slide.ctaText}
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Mobilde gizli veya küçük, desktop'ta büyük */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary hidden sm:flex items-center justify-center"
        style={{ zIndex: Z_INDEX.sticky }}
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary hidden sm:flex items-center justify-center"
        style={{ zIndex: Z_INDEX.sticky }}
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Swipe İpucu - Sadece mobilde */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:hidden" style={{ zIndex: Z_INDEX.sticky }}>
        <p className="text-xs text-white/50 flex items-center gap-1">
          <ChevronLeft className="h-3 w-3" />
          Kaydırın
          <ChevronRight className="h-3 w-3" />
        </p>
      </div>

      {/* Dots Indicator - Mobilde daha büyük touch hedefi */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-2" style={{ zIndex: Z_INDEX.sticky }}>
        {banners.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black",
              // Mobilde daha büyük dokunma alanı
              "min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center",
              index === currentSlide
                ? "bg-transparent"
                : "bg-transparent"
            )}
            aria-label={`Slayt ${index + 1}: ${slide.title}`}
            aria-current={index === currentSlide ? "true" : "false"}
          >
            <span
              className={cn(
                "block h-2 md:h-2 rounded-full transition-all",
                index === currentSlide
                  ? "bg-primary w-6 md:w-8"
                  : "bg-white/40 hover:bg-white/60 w-2"
              )}
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20" style={{ zIndex: Z_INDEX.sticky }}>
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / banners.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
}
