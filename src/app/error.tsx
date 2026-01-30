"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Hata loglama servisi için (örn: Sentry, LogRocket)
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* İkon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        {/* Başlık */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Bir Şeyler Ters Gitti
          </h1>
          <p className="text-muted-foreground">
            Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin
            veya ana sayfaya dönün.
          </p>
        </div>

        {/* Hata Detayı (Development'ta) */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Hata ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Aksiyonlar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>

        {/* Destek Linki */}
        <p className="text-sm text-muted-foreground">
          Sorun devam ederse{" "}
          <a
            href="mailto:destek@optimi.gg"
            className="text-primary hover:underline"
          >
            destek@optimi.gg
          </a>{" "}
          adresinden bize ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
