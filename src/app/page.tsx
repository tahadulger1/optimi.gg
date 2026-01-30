import { Header, HeroBanner, GameCards, TournamentSection, Footer } from "@/components/shared";

export default function Home() {
  return (
    <main className="min-h-screen bg-optimi-darker">
      {/* Header */}
      <Header />

      {/* Hero Banner / Carousel - Header'ın arkasına girer, şeffaf navbar için */}
      <HeroBanner />

      {/* Game Selection Cards */}
      <GameCards />

      {/* Tournaments Section */}
      <TournamentSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
