"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { History, Settings, Loader2, Award } from "lucide-react";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileSidebar, PastTournamentsTab, SettingsTab, RankTab } from "@/features/profile/components";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading, updateProfile } = useAuth();

  // Auth kontrolü - giriş yapmamışsa yönlendir
  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/giris");
    }
  }, [isLoading, isLoggedIn, router]);

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa yönlendiriliyor
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-20 lg:pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Sayfa Başlığı */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profilim</h1>
            <p className="text-muted-foreground mt-1">
              Profil bilgilerini görüntüle ve düzenle
            </p>
          </div>

          {/* Ana İçerik - 2 Sütunlu Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sol Sütun - Profil Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24">
                <ProfileSidebar user={user} />
              </div>
            </aside>

            {/* Sağ Sütun - Tabs */}
            <section className="lg:col-span-8 xl:col-span-9">
              <Tabs defaultValue="settings" className="w-full">
                {/* TabsList - Mobilde yatay scroll */}
                <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
                  <TabsList className="inline-flex w-auto min-w-full sm:w-auto bg-optimi-surface border border-border/50 p-1 h-auto">
                    <TabsTrigger 
                      value="rank"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      <Award className="h-4 w-4" />
                      <span>Rütbe</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tournaments"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      <History className="h-4 w-4" />
                      <span className="hidden xs:inline">Geçmiş</span> <span>Turnuvalar</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Ayarlar</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Rütbe Tab */}
                <TabsContent value="rank" className="mt-6">
                  <RankTab user={user} />
                </TabsContent>

                {/* Geçmiş Turnuvalar Tab */}
                <TabsContent value="tournaments" className="mt-6">
                  <PastTournamentsTab />
                </TabsContent>

                {/* Ayarlar Tab */}
                <TabsContent value="settings" className="mt-6">
                  <SettingsTab user={user} onUpdateProfile={updateProfile} />
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
