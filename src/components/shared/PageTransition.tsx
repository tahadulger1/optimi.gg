"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Hafif fade-in animasyonu - blocking yok
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// Kısa transition süresi - hızlı sayfa geçişi
const pageTransition = {
  duration: 0.15,
  ease: "easeOut",
};

/**
 * Sayfa geçiş animasyonları için wrapper component
 * Sadece fade-in animasyonu - blocking yok, hızlı ve güvenilir
 * 
 * Not: AnimatePresence mode="wait" kaldırıldı çünkü
 * async component'lerde sayfa geçişini bloke edebiliyordu
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      style={{
        willChange: "opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
