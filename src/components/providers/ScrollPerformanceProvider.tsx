"use client";

import { useScrollPerformance } from "@/hooks";

interface ScrollPerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Uygulama genelinde scroll performansını optimize eden provider
 * - Scroll sırasında body'ye 'is-scrolling' class'ı ekler
 * - CSS ile pointer-events devre dışı bırakılır
 * - 60fps scroll performansı sağlar
 */
export function ScrollPerformanceProvider({ children }: ScrollPerformanceProviderProps) {
  // Scroll performansı hook'unu aktif et
  useScrollPerformance({
    debounceMs: 150,
    addScrollingClass: true,
  });

  return <>{children}</>;
}
