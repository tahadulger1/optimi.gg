"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary
 * Root layout dahil tüm hataları yakalar
 * Kendi HTML/body yapısını içermelidir
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Kritik hata loglama
    console.error("Kritik uygulama hatası:", error);
  }, [error]);

  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* İkon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertOctagon className="w-10 h-10 text-red-500" />
          </div>

          {/* Başlık */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Kritik Hata</h1>
            <p className="text-gray-400">
              Uygulama beklenmeyen bir hatayla karşılaştı. Bu durumu en kısa
              sürede çözmek için çalışıyoruz.
            </p>
          </div>

          {/* Hata Detayı (Development'ta) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
              <p className="text-xs font-mono text-red-400 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Hata ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Yenile Butonu */}
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Uygulamayı Yenile
          </button>

          {/* Alternatif Aksiyonlar */}
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <p>Veya şunları deneyebilirsiniz:</p>
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  className="text-amber-500 hover:underline"
                >
                  Ana sayfaya git
                </a>
              </li>
              <li>
                <button
                  onClick={() => window.location.reload()}
                  className="text-amber-500 hover:underline"
                >
                  Sayfayı yeniden yükle
                </button>
              </li>
              <li>
                <a
                  href="mailto:destek@optimi.gg"
                  className="text-amber-500 hover:underline"
                >
                  Destek ile iletişime geç
                </a>
              </li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}
