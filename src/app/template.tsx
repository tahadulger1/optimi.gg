/**
 * Next.js Template Component
 * 
 * Performans için PageTransition kaldırıldı.
 * Sayfa geçişleri artık Next.js native router ile anında gerçekleşir.
 * 
 * Not: Animasyon istenirse PageTransition tekrar eklenebilir,
 * ancak bu sayfa geçişlerine ~150ms gecikme ekler.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
