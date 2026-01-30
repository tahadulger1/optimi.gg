/**
 * Web Vitals Metrikleri
 * Core Web Vitals'ı izlemek için kullanılır
 * 
 * Metrikler:
 * - LCP (Largest Contentful Paint): İdeal < 2.5s
 * - FID (First Input Delay): İdeal < 100ms
 * - CLS (Cumulative Layout Shift): İdeal < 0.1
 * - FCP (First Contentful Paint): İdeal < 1.8s
 * - TTFB (Time to First Byte): İdeal < 800ms
 * - INP (Interaction to Next Paint): İdeal < 200ms
 */

export type WebVitalsMetric = {
  id: string;
  name: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType: "navigate" | "reload" | "back_forward" | "prerender";
};

/**
 * Metrik değerini iyi/orta/kötü olarak değerlendirir
 */
function getRating(name: string, value: number): WebVitalsMetric["rating"] {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

/**
 * Web Vitals metriklerini console'a loglar (development)
 */
export function logWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    good: "color: #10b981",
    "needs-improvement": "color: #f59e0b",
    poor: "color: #ef4444",
  };

  console.log(
    `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`,
    colors[metric.rating]
  );
}

/**
 * Web Vitals metriklerini analytics servisine gönderir
 */
export function sendToAnalytics(metric: WebVitalsMetric) {
  // Google Analytics 4 örneği
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Custom analytics endpoint örneği
  // fetch("/api/analytics/vitals", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     ...metric,
  //     timestamp: Date.now(),
  //     url: window.location.href,
  //     userAgent: navigator.userAgent,
  //   }),
  // }).catch(console.error);
}

/**
 * Performans önerilerini döndürür
 */
export function getPerformanceTips(metrics: WebVitalsMetric[]): string[] {
  const tips: string[] = [];

  metrics.forEach((metric) => {
    if (metric.rating === "poor") {
      switch (metric.name) {
        case "LCP":
          tips.push(
            "LCP düşük: Büyük görselleri optimize edin, critical CSS kullanın, lazy loading uygulayın"
          );
          break;
        case "FID":
        case "INP":
          tips.push(
            "Etkileşim yavaş: JavaScript bundle'ını küçültün, heavy computation'ları web worker'a taşıyın"
          );
          break;
        case "CLS":
          tips.push(
            "Layout kayması var: Görsellere width/height verin, dinamik içerik için yer ayırın"
          );
          break;
        case "TTFB":
          tips.push(
            "Server yanıtı yavaş: CDN kullanın, cache stratejinizi gözden geçirin"
          );
          break;
        case "FCP":
          tips.push(
            "İlk çizim yavaş: Render-blocking kaynakları azaltın, font-display: swap kullanın"
          );
          break;
      }
    }
  });

  return tips;
}
