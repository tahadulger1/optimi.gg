"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseScrollPerformanceOptions {
  /** Scroll durduğunda pointer events'i aktif etmek için bekleme süresi (ms) */
  debounceMs?: number;
  /** Scroll sırasında body'ye class ekle */
  addScrollingClass?: boolean;
}

/**
 * Scroll performansını artırmak için hook
 * - Scroll sırasında pointer-events'i devre dışı bırakır
 * - requestAnimationFrame ile throttle eder
 * - Passive scroll listener kullanır
 */
export function useScrollPerformance(options: UseScrollPerformanceOptions = {}) {
  const { debounceMs = 150, addScrollingClass = true } = options;
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef(false);

  const handleScrollStart = useCallback(() => {
    if (!isScrolling.current && addScrollingClass) {
      document.body.classList.add("is-scrolling");
      isScrolling.current = true;
    }
  }, [addScrollingClass]);

  const handleScrollEnd = useCallback(() => {
    if (addScrollingClass) {
      document.body.classList.remove("is-scrolling");
    }
    isScrolling.current = false;
  }, [addScrollingClass]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Scroll başladığında
      handleScrollStart();

      // Önceki timeout'u temizle
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Debounce ile scroll bitişini algıla
      scrollTimeout.current = setTimeout(handleScrollEnd, debounceMs);

      // RAF ile throttle (opsiyonel ekstra işlemler için)
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive listener - tarayıcıya scroll'u engellemeyeceğimizi söyler
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      handleScrollEnd();
    };
  }, [debounceMs, handleScrollStart, handleScrollEnd]);

  return { isScrolling: isScrolling.current };
}

/**
 * Belirli bir element için scroll performansı
 */
export function useElementScrollPerformance(
  elementRef: React.RefObject<HTMLElement>,
  options: UseScrollPerformanceOptions = {}
) {
  const { debounceMs = 100 } = options;
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Scroll sırasında children'ların pointer-events'ini kapat
      if (!ticking) {
        window.requestAnimationFrame(() => {
          element.style.pointerEvents = "none";
          ticking = false;
        });
        ticking = true;
      }

      // Scroll bitince pointer-events'i aç
      scrollTimeout.current = setTimeout(() => {
        element.style.pointerEvents = "";
      }, debounceMs);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      element.style.pointerEvents = "";
    };
  }, [elementRef, debounceMs]);
}
