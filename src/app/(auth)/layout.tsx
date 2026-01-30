import Link from "next/link";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sol taraf - Dekoratif Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-optimi-darker overflow-hidden">
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 bg-gradient-to-br from-optimi-dark via-optimi-darker to-black" />
        
        {/* Dekoratif Elementler */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Deseni */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* İçerik */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/img/logo.png"
              alt="Optimi.gg"
              width={140}
              height={46}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Ana Mesaj */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Türkiye&apos;nin<br />
              <span className="text-gradient-gold">Espor Platformu</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Turnuvalara katıl, takımını kur, rakiplerini bul ve espor kariyerine 
              Optimi.gg ile başla.
            </p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Aktif Oyuncu</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-500">1000+</p>
              <p className="text-sm text-muted-foreground">Turnuva</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-info">₺500K+</p>
              <p className="text-sm text-muted-foreground">Ödül Havuzu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Form Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Mobil Logo */}
        <div className="lg:hidden p-6 border-b border-border">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/img/logo.png"
              alt="Optimi.gg"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground border-t border-border">
          <p>
            &copy; {new Date().getFullYear()} Optimi.gg. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
