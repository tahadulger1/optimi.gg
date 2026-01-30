"use client";

import { useCallback, useRef, useState, useEffect, type RefObject } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down" | null;

export interface SwipeState {
  /** Swipe işlemi devam ediyor mu */
  isSwiping: boolean;
  /** Mevcut swipe yönü */
  direction: SwipeDirection;
  /** Yatay delta (px) */
  deltaX: number;
  /** Dikey delta (px) */
  deltaY: number;
  /** Swipe hızı (px/ms) */
  velocity: number;
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeEnd?: (direction: SwipeDirection, velocity: number) => void;
  onSwipeMove?: (deltaX: number, deltaY: number) => void;
}

export interface SwipeOptions {
  /** Minimum swipe mesafesi (px) - varsayılan: 50 */
  threshold?: number;
  /** Hızlı swipe için minimum velocity (px/ms) - varsayılan: 0.5 */
  velocityThreshold?: number;
  /** Yatay swipe'ı engelle - varsayılan: false */
  preventHorizontal?: boolean;
  /** Dikey swipe'ı engelle - varsayılan: false */
  preventVertical?: boolean;
  /** Swipe sırasında default davranışı engelle - varsayılan: false */
  preventDefault?: boolean;
  /** Sadece touch eventleri için - varsayılan: true */
  touchOnly?: boolean;
}

const defaultOptions: Required<SwipeOptions> = {
  threshold: 50,
  velocityThreshold: 0.5,
  preventHorizontal: false,
  preventVertical: false,
  preventDefault: false,
  touchOnly: true,
};

/**
 * Touch/swipe event yönetimi için custom hook
 * Mobil cihazlarda swipe gesture'ları algılar
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { state, bind } = useSwipe(containerRef, {
 *   onSwipeLeft: () => nextSlide(),
 *   onSwipeRight: () => prevSlide(),
 * });
 * 
 * return <div ref={containerRef} {...bind}>Content</div>;
 * ```
 */
export function useSwipe<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handlers: SwipeHandlers = {},
  options: SwipeOptions = {}
) {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
  });

  // Touch başlangıç noktası
  const startPos = useRef({ x: 0, y: 0 });
  // Touch başlangıç zamanı (velocity hesabı için)
  const startTime = useRef(0);
  // Aktif swipe mi
  const isActive = useRef(false);

  const getDirection = useCallback((deltaX: number, deltaY: number): SwipeDirection => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX < opts.threshold && absY < opts.threshold) {
      return null;
    }

    if (absX > absY) {
      if (opts.preventHorizontal) return null;
      return deltaX > 0 ? "right" : "left";
    } else {
      if (opts.preventVertical) return null;
      return deltaY > 0 ? "down" : "up";
    }
  }, [opts.threshold, opts.preventHorizontal, opts.preventVertical]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    isActive.current = true;

    setState({
      isSwiping: true,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
    });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isActive.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const direction = getDirection(deltaX, deltaY);

    // Yatay swipe sırasında dikey scroll'u engelle
    if (opts.preventDefault && direction && (direction === "left" || direction === "right")) {
      e.preventDefault();
    }

    const elapsed = Date.now() - startTime.current;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;

    setState({
      isSwiping: true,
      direction,
      deltaX,
      deltaY,
      velocity,
    });

    handlers.onSwipeMove?.(deltaX, deltaY);

    if (direction && !state.direction) {
      handlers.onSwipeStart?.(direction);
    }
  }, [getDirection, opts.preventDefault, handlers, state.direction]);

  const handleTouchEnd = useCallback(() => {
    if (!isActive.current) return;
    isActive.current = false;

    const { deltaX, deltaY } = state;
    const direction = getDirection(deltaX, deltaY);
    const elapsed = Date.now() - startTime.current;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;

    // Threshold veya velocity kontrolü
    const isValidSwipe = 
      Math.abs(deltaX) >= opts.threshold || 
      Math.abs(deltaY) >= opts.threshold ||
      velocity >= opts.velocityThreshold;

    if (isValidSwipe && direction) {
      handlers.onSwipeEnd?.(direction, velocity);

      switch (direction) {
        case "left":
          handlers.onSwipeLeft?.();
          break;
        case "right":
          handlers.onSwipeRight?.();
          break;
        case "up":
          handlers.onSwipeUp?.();
          break;
        case "down":
          handlers.onSwipeDown?.();
          break;
      }
    }

    setState({
      isSwiping: false,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
    });
  }, [state, getDirection, opts.threshold, opts.velocityThreshold, handlers]);

  // Mouse events (opsiyonel - desktop test için)
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (opts.touchOnly) return;

    startPos.current = { x: e.clientX, y: e.clientY };
    startTime.current = Date.now();
    isActive.current = true;

    setState({
      isSwiping: true,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
    });
  }, [opts.touchOnly]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (opts.touchOnly || !isActive.current) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const direction = getDirection(deltaX, deltaY);

    const elapsed = Date.now() - startTime.current;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;

    setState({
      isSwiping: true,
      direction,
      deltaX,
      deltaY,
      velocity,
    });

    handlers.onSwipeMove?.(deltaX, deltaY);
  }, [opts.touchOnly, getDirection, handlers]);

  const handleMouseUp = useCallback(() => {
    if (opts.touchOnly || !isActive.current) return;
    handleTouchEnd();
  }, [opts.touchOnly, handleTouchEnd]);

  // Event listener'ları ekle/kaldır
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Touch events
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: !opts.preventDefault });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    // Mouse events (opsiyonel)
    if (!opts.touchOnly) {
      element.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchEnd);

      if (!opts.touchOnly) {
        element.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [
    ref,
    opts.touchOnly,
    opts.preventDefault,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  ]);

  // Inline event handler'lar (alternatif kullanım için)
  const bind = {
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      startPos.current = { x: touch.clientX, y: touch.clientY };
      startTime.current = Date.now();
      isActive.current = true;
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!isActive.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      handlers.onSwipeMove?.(deltaX, deltaY);
    },
    onTouchEnd: handleTouchEnd,
  };

  return { state, bind };
}

/**
 * Basit swipe hook - sadece yön callback'leri
 */
export function useSwipeSimple(
  ref: RefObject<HTMLElement | null>,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options?: SwipeOptions
) {
  return useSwipe(ref, { onSwipeLeft, onSwipeRight }, options);
}
