import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryProvider, ScrollPerformanceProvider } from "@/components/providers";
import { RouteChangeLoader } from "@/components/shared";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Optimi.gg - Türkiye'nin Espor Platformu",
    template: "%s | Optimi.gg",
  },
  description:
    "Türkiye'nin önde gelen espor platformu. Turnuvalar, etkinlikler, lobi bulma ve daha fazlası.",
  keywords: [
    "espor",
    "esports",
    "turnuva",
    "tournament",
    "valorant",
    "league of legends",
    "tft",
    "gaming",
    "oyun",
    "türkiye",
  ],
  authors: [{ name: "Optimi.gg" }],
  creator: "Optimi.gg",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Optimi.gg",
    title: "Optimi.gg - Türkiye'nin Espor Platformu",
    description:
      "Türkiye'nin önde gelen espor platformu. Turnuvalar, etkinlikler, lobi bulma ve daha fazlası.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optimi.gg - Türkiye'nin Espor Platformu",
    description:
      "Türkiye'nin önde gelen espor platformu. Turnuvalar, etkinlikler, lobi bulma ve daha fazlası.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ScrollPerformanceProvider>
            {children}
          </ScrollPerformanceProvider>
        </QueryProvider>
        <Suspense fallback={null}>
          <RouteChangeLoader />
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
