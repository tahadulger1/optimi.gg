"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";

// Maximum loading süresi (ms) - bu süreden sonra zorla kapat
const MAX_LOADING_DURATION = 3000;
// Minimum loading süresi (ms) - çok kısa tutarak hızlı geçiş sağla
const MIN_LOADING_DURATION = 0;
// Loading gösterilmeden önce beklenecek süre (ms)
// Hızlı geçişlerde loading hiç görünmez
const SHOW_DELAY = 150;

/**
 * Route Change Loader
 * Sayfa geçişlerinde logo animasyonlu yükleme ekranı gösterir
 * Timeout fallback ile güvenli bir şekilde kapanır
 */
export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Ref'ler - timeout'ları takip etmek için
  const loadingStartTime = useRef<number>(0);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathRef = useRef<string>("");
  const isNavigatingRef = useRef<boolean>(false);

  // Tüm timeout'ları temizle
  const clearAllTimeouts = useCallback(() => {
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
  }, []);

  // Loading'i güvenli şekilde kapat
  const hideLoader = useCallback(() => {
    clearAllTimeouts();
    isNavigatingRef.current = false;
    
    // Minimum gösterim süresini hesapla
    const elapsed = Date.now() - loadingStartTime.current;
    const remainingMinTime = Math.max(0, MIN_LOADING_DURATION - elapsed);
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      // Fade out animasyonu için minimal gecikme
      setTimeout(() => setIsVisible(false), 50);
    }, remainingMinTime);
  }, [clearAllTimeouts]);

  // Loading'i başlat (gecikmeli - hızlı geçişlerde hiç gösterilmez)
  const showLoader = useCallback(() => {
    // Eğer zaten navigasyon yapılıyorsa, tekrar başlatma
    if (isNavigatingRef.current) return;
    
    clearAllTimeouts();
    loadingStartTime.current = Date.now();
    isNavigatingRef.current = true;
    
    // SHOW_DELAY ms bekle, eğer hala navigasyon devam ediyorsa göster
    showDelayTimeoutRef.current = setTimeout(() => {
      // Hala navigasyon yapılıyorsa loading'i göster
      if (isNavigatingRef.current) {
        setIsVisible(true);
        requestAnimationFrame(() => {
          setIsLoading(true);
        });
      }
    }, SHOW_DELAY);
    
    // Maximum timeout - güvenlik önlemi olarak
    maxTimeoutRef.current = setTimeout(() => {
      console.warn("[RouteChangeLoader] Maximum loading süresi aşıldı, zorla kapatılıyor");
      hideLoader();
    }, MAX_LOADING_DURATION);
  }, [clearAllTimeouts, hideLoader]);

  // Route değişikliklerini izle - sayfa yüklendiğinde loading'i kapat
  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() || "");
    
    // İlk render'da veya path gerçekten değiştiyse
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      // Yeni sayfa yüklendi, loading'i kapat
      hideLoader();
    }
    
    previousPathRef.current = currentPath;
    
    return () => {
      clearAllTimeouts();
    };
  }, [pathname, searchParams, hideLoader, clearAllTimeouts]);

  // Link tıklamalarını intercept et
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      
      // External link, new tab, veya hash link ise skip
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank"
      ) {
        return;
      }
      
      // Aynı sayfaya gidiyorsa skip
      const currentPath = window.location.pathname;
      const targetPath = href.split("?")[0].split("#")[0];
      
      if (targetPath === currentPath) {
        return;
      }
      
      // Loading'i başlat
      showLoader();
    };

    document.addEventListener("click", handleClick, { passive: true });
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showLoader]);

  // Router push/replace için window event dinle (programmatic navigation)
  useEffect(() => {
    const handleStart = () => {
      showLoader();
    };

    window.addEventListener("routeChangeStart", handleStart);
    
    return () => {
      window.removeEventListener("routeChangeStart", handleStart);
    };
  }, [showLoader]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center transition-opacity duration-150",
        "bg-background/90 backdrop-blur-md",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ zIndex: Z_INDEX.loading }}
      aria-hidden={!isLoading}
      role="progressbar"
      aria-label="Sayfa yükleniyor"
    >
      {/* Arka Plan Glow Efekti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl",
            "transition-transform duration-700",
            isLoading ? "scale-100" : "scale-50"
          )} 
        />
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[300px] h-[300px] bg-primary/20 rounded-full blur-2xl",
            "transition-transform duration-500 delay-100",
            isLoading ? "scale-100" : "scale-50"
          )}
        />
      </div>

      {/* Logo ve Animasyon */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo Container */}
        <div className="relative">
          {/* Logo Glow Ring */}
          <div 
            className={cn(
              "absolute -inset-8 rounded-full",
              "bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0",
              "animate-spin-slow opacity-60"
            )}
            style={{ animationDuration: "3s" }}
          />
          
          {/* Logo Pulse Background */}
          <div className="absolute -inset-4 bg-primary/10 rounded-2xl animate-pulse-slow" />
          
          {/* Ana Logo */}
          <div 
            className={cn(
              "relative transition-all duration-500",
              isLoading ? "scale-100 rotate-0" : "scale-90 -rotate-12"
            )}
          >
            <Image
              src="/img/logo.png"
              alt="Optimi.gg"
              width={200}
              height={70}
              className="h-16 w-auto drop-shadow-[0_0_40px_rgba(250,204,21,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-4">
          {/* Progress Bar */}
          <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full",
                "animate-progress-loading"
              )}
            />
          </div>
          
          {/* Loading Text with Dots */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Yükleniyor</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accent Lines */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-xl opacity-50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30 rounded-tr-xl opacity-50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30 rounded-bl-xl opacity-50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-xl opacity-50" />
    </div>
  );
}

/**
 * Utility: Programmatic navigation sırasında loading'i tetiklemek için
 * router.push() çağırmadan önce bu fonksiyonu çağırın
 */
export function triggerRouteChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("routeChangeStart"));
  }
}
