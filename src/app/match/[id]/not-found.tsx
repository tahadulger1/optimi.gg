"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchNotFound() {
  const router = useRouter();

  // Güvenli geri dönüş handler'ı
  const handleGoBack = () => {
    // Tarayıcı geçmişinde geri gidilecek sayfa varsa geri git
    // Yoksa ana sayfaya yönlendir
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Maç Bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">
          Aradığınız maç odası mevcut değil veya silinmiş olabilir.
        </p>
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
