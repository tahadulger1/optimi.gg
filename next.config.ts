import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // React Compiler (otomatik memoization)
  reactCompiler: true,

  // Experimental features
  experimental: {
    // Büyük paketlerin tree-shaking'ini optimize et
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-avatar",
    ],
    // View Transitions API (akıcı sayfa geçişleri)
    viewTransition: true,
  },

  // Image optimization
  images: {
    // Modern formatları tercih et (daha küçük boyut)
    formats: ["image/avif", "image/webp"],
    // Cihaz boyutlarına göre srcset oluştur
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Harici görsel kaynakları
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.optimi.gg",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Performans için gereksiz header'ları kaldır
  poweredByHeader: false,

  // Production'da console.log'ları kaldır
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withBundleAnalyzer(nextConfig);
