"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, User, LogOut, Swords, Award, Globe, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Z_INDEX } from "@/lib/z-index";
import { RankBadge, RANK_TIER, type RankTier } from "@/features/rank";

// Geçici: UserRank'ı RankTier'a dönüştür
function convertUserRankToRankTier(userRank: string): RankTier {
  const rankMap: Record<string, RankTier> = {
    bronze: RANK_TIER.BRONZE,
    silver: RANK_TIER.SILVER,
    gold: RANK_TIER.GOLD,
    platinum: RANK_TIER.PLATINUM,
    diamond: RANK_TIER.DIAMOND,
    mastery: RANK_TIER.MASTERY,
    master: RANK_TIER.MASTER,
    grandmaster: RANK_TIER.MASTER,
  };
  return rankMap[userRank] || RANK_TIER.BRONZE;
}

// Dropdown alt menü öğeleri - Turnuvalar
const turnuvalarDropdown = [
  {
    label: "Online Turnuvalar",
    href: "/turnuvalar/online",
    description: "Evinden katılabileceğin online turnuvalar",
    icon: Globe,
  },
  {
    label: "Offline Turnuvalar",
    href: "/turnuvalar/offline",
    description: "Yüz yüze LAN turnuvaları ve etkinlikler",
    icon: MapPin,
  },
  {
    label: "Tüm Turnuvalar",
    href: "/turnuvalar",
    description: "Tüm turnuvaları keşfedin",
    icon: Trophy,
  },
];

const navItems = [
  {
    label: "Turnuvalar",
    href: "/turnuvalar",
    hasDropdown: true,
    dropdownItems: turnuvalarDropdown,
  },
  {
    label: "Lobi Bul",
    href: "/lobi-bul",
    hasDropdown: false,
    dropdownItems: null,
  },
  {
    label: "Etkinlikler",
    href: "/etkinlikler",
    hasDropdown: false,
    dropdownItems: null,
  },
  {
    label: "Market",
    href: "/market",
    hasDropdown: false,
    dropdownItems: null,
  },
] as const;

export function Header() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        // requestAnimationFrame ile throttle - scroll performansı için kritik
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Passive listener - scroll performansını artırır
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // Mobil menü açıkken scroll'u engelle
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Mobile Navigation Overlay - Portal ile body'ye taşınıyor (stacking context sorunu için)
  const mobileMenuOverlay = (
    <div
      className={cn(
        "lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[hsl(240,10%,3.9%)] transition-all duration-300 overflow-y-auto",
        isMobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      style={{ zIndex: Z_INDEX.mobileMenu }}
    >
      <nav className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <div key={item.href}>
              {item.hasDropdown && item.dropdownItems ? (
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-xl transition-all duration-300",
                      isMobileMenuOpen && "animate-fade-in"
                    )}
                    style={{
                      animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      "h-5 w-5 opacity-50 transition-transform",
                      activeDropdown === item.label && "rotate-180"
                    )} />
                  </button>

                  {/* Mobil Dropdown Alt Menü */}
                  {activeDropdown === item.label && (
                    <div className="pl-4 space-y-1 animate-fade-in">
                      {item.dropdownItems.map((dropdownItem) => {
                        const Icon = dropdownItem.icon;
                        return (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="flex items-center gap-3 px-4 py-3 text-base text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <span>{dropdownItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-xl transition-all duration-300",
                    isMobileMenuOpen && "animate-fade-in"
                  )}
                  style={{
                    animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="h-5 w-5 opacity-50" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Auth Buttons */}
        <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border/30">
          {isLoggedIn && user ? (
            <>
              {/* Kullanıcı Bilgisi */}
              <div className="flex items-center gap-3 px-4 py-3 bg-optimi-surface rounded-xl">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <RankBadge 
                      tier={convertUserRankToRankTier(user.rank)} 
                      size="xs" 
                      variant="icon-only" 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{user.username}</p>
                    <RankBadge 
                      tier={convertUserRankToRankTier(user.rank)} 
                      size="xs" 
                      showIcon={false}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center border-border/60 bg-transparent text-foreground hover:bg-white/5 rounded-xl"
                asChild
              >
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Profilim
                </Link>
              </Button>


              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 rounded-xl"
                asChild
              >
                <Link href="/match/match-001" onClick={() => setIsMobileMenuOpen(false)}>
                  <Swords className="mr-2 h-4 w-4" />
                  Demo Maç Odası
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 rounded-xl"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center border-border/60 bg-transparent text-foreground hover:bg-white/5 rounded-xl"
                asChild
              >
                <Link href="/kayit" onClick={() => setIsMobileMenuOpen(false)}>
                  Kayıt Ol
                </Link>
              </Button>
              <Button
                size="lg"
                className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20"
                asChild
              >
                <Link href="/giris" onClick={() => setIsMobileMenuOpen(false)}>
                  Giriş Yap
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );

  // SSR uyumluluğu için mounted state
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 fixed-optimized",
          // Transition sadece background ve border için - transform değil
          "transition-[background-color,border-color] duration-200 ease-out",
          isScrolled
            ? "bg-optimi-darker/98 border-b border-border/50"
            : "bg-transparent border-b border-transparent"
        )}
        style={{ zIndex: Z_INDEX.header }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/img/logo.png"
                alt="Optimi.gg Logo"
                width={140}
                height={46}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown && item.dropdownItems ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="group flex items-center gap-2 px-6 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-all duration-200 rounded-lg hover:bg-white/5"
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          "h-5 w-5 opacity-50 group-hover:opacity-100 transition-all",
                          activeDropdown === item.label && "rotate-180"
                        )} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === item.label && (
                        <>
                          <div 
                            className="fixed inset-0" 
                            style={{ zIndex: Z_INDEX.header }}
                            onClick={() => setActiveDropdown(null)} 
                          />
                          <div 
                            className="absolute left-0 top-full mt-2 w-72 bg-optimi-surface border border-border/50 rounded-xl shadow-xl overflow-hidden animate-fade-in"
                            style={{ zIndex: Z_INDEX.headerDropdown }}
                          >
                            {item.dropdownItems.map((dropdownItem) => {
                              const Icon = dropdownItem.icon;
                              return (
                                <Link
                                  key={dropdownItem.href}
                                  href={dropdownItem.href}
                                  className="flex items-start gap-3 px-4 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{dropdownItem.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{dropdownItem.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 px-6 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-all duration-200 rounded-lg hover:bg-white/5"
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-y-0.5" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              ) : isLoggedIn && user ? (
                /* Kullanıcı Giriş Yapmış */
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-primary/30">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <RankBadge 
                          tier={convertUserRankToRankTier(user.rank)} 
                          size="xs" 
                          variant="icon-only" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{user.username}</span>
                      <RankBadge 
                        tier={convertUserRankToRankTier(user.rank)} 
                        size="xs" 
                        showIcon={false}
                      />
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isUserMenuOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0" 
                        style={{ zIndex: Z_INDEX.header }}
                        onClick={() => setIsUserMenuOpen(false)} 
                      />
                      <div 
                        className="absolute right-0 top-full mt-2 w-52 bg-optimi-surface border border-border/50 rounded-lg shadow-xl overflow-hidden"
                        style={{ zIndex: Z_INDEX.headerDropdown }}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profilim
                        </Link>
                        <Link
                          href="/match/match-001"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Swords className="h-4 w-4 text-primary" />
                          <span>Demo Maç Odası</span>
                          <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">YENİ</span>
                        </Link>
                        <div className="border-t border-border/50" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Kullanıcı Giriş Yapmamış */
                <>
                  <Button
                    variant="outline"
                    className="border-border/60 bg-transparent text-foreground/80 hover:text-foreground hover:bg-white/5 hover:border-border rounded-lg px-6 py-2.5 text-base"
                    asChild
                  >
                    <Link href="/kayit">Kayıt Ol</Link>
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 rounded-lg px-6 py-2.5 text-base shadow-lg shadow-emerald-600/20"
                    asChild
                  >
                    <Link href="/giris">Giriş Yap</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 text-foreground hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menüyü aç/kapat"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu - Portal ile body'ye taşınıyor */}
      {isMounted && createPortal(mobileMenuOverlay, document.body)}
    </>
  );
}
