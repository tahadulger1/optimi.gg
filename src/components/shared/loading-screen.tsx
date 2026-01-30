"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";

interface LoadingScreenProps {
  /** Tam ekran mı yoksa inline mı */
  variant?: "fullscreen" | "inline" | "overlay";
  /** Yükleme mesajı */
  message?: string;
  /** Logo gösterilsin mi */
  showLogo?: boolean;
  /** Ek CSS class'ları */
  className?: string;
}

/**
 * Optimi.gg Animasyonlu Yükleme Ekranı
 * Gerçek logo ile modern espor estetiği
 */
export function LoadingScreen({
  variant = "fullscreen",
  message,
  showLogo = true,
  className,
}: LoadingScreenProps) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-8",
    {
      "min-h-screen bg-background": variant === "fullscreen",
      "min-h-[400px] py-16": variant === "inline",
      "fixed inset-0 bg-background/95 backdrop-blur-sm":
        variant === "overlay",
    },
    className
  );

  const containerStyle = variant === "overlay" ? { zIndex: Z_INDEX.loading } : undefined;

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-2xl animate-pulse-slower" />
      </div>

      {showLogo && (
        <div className="relative z-10">
          {/* Logo Glow Effect */}
          <div className="absolute inset-0 blur-2xl opacity-50 animate-pulse-slow">
            <div className="w-40 h-16 bg-primary/30 rounded-xl" />
          </div>
          
          {/* Ana Logo - Gerçek logo dosyası */}
          <div className="relative animate-float">
            <Image
              src="/img/logo.png"
              alt="Optimi.gg"
              width={180}
              height={60}
              className="h-14 w-auto drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              priority
            />
          </div>
        </div>
      )}

      {/* Loading Spinner Ring - Gradient */}
      <div className="relative z-10">
        <GradientSpinner />
      </div>

      {/* Loading Text */}
      {message && (
        <p className="relative z-10 text-muted-foreground text-sm font-medium tracking-wide animate-fade-in">
          {message}
        </p>
      )}

      {/* Animated Dots */}
      <div className="relative z-10">
        <LoadingDots />
      </div>
    </div>
  );
}

/**
 * Gradient Dönen Spinner
 * Premium görünüm için gradient halka
 */
function GradientSpinner() {
  return (
    <div className="relative w-16 h-16">
      {/* Dış Halka - Gradient */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
      
      {/* Dönen Gradient Halka */}
      <div 
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 0deg, transparent, transparent 60%, hsl(var(--primary)) 100%)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
        }}
      />
      
      {/* İç Glow */}
      <div className="absolute inset-3 rounded-full bg-primary/5 animate-pulse" />
      
      {/* Merkez Nokta */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
      </div>
    </div>
  );
}

/**
 * Animasyonlu Yükleniyor Noktaları
 */
function LoadingDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Yükleniyor</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot"
            style={{
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Minimal Loading Spinner
 * Küçük inline kullanımlar için
 */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  );
}

/**
 * Skeleton Pulse
 * İçerik yüklenirken placeholder olarak kullanılır
 */
export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-muted/50",
        className
      )}
    />
  );
}
