import { LobbyList } from "@/features/lobby";
import { Header, Footer } from "@/components/shared";

export const metadata = {
  title: "Lobi Bul | Optimi.gg",
  description: "Aktif lobileri keşfet ve oyunculara katıl. Valorant, League of Legends ve daha fazlası için takım arkadaşı bul.",
};

export default function LobbyFinderPage() {
  return (
    <main className="min-h-screen bg-optimi-darker flex flex-col">
      <Header />
      {/* Header fixed olduğu için içeriğe üst padding eklendi */}
      <div className="container mx-auto px-4 pt-24 lg:pt-28 pb-8 flex-1">
        <LobbyList />
      </div>
      <Footer />
    </main>
  );
}
