"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/shared";

const faqItems = [
  {
    question: "Turnuvalara nasıl kayıt olabilirim?",
    answer:
      "Turnuva kayıt rehberi videomuzu inceleyerek turnuvalarımıza kolayca kayıt olabilirsiniz.",
    hasVideoLink: true,
  },
  {
    question: "Kafe turnuva ödülleri kişi başı mı takım başı mı?",
    answer:
      "Kafe turnuva ödüllerimizi takım başıdır. Kazanacağınız OPTIMI Pointslerle marketimizden RP, VP ve hediye çekleri alabilirsiniz.",
  },
  {
    question: "Offline turnuvalar ücretli mi?",
    answer:
      "Kafeden kafeye değişkenlik göstermektedir. Bazı kafeler masa saati ücreti alırken bazı kafeler ücretsiz yapmaktadır. Özetle kafe sahibinin inisiyatifine kalmaktadır.",
  },
  {
    question: "Offline turnuvalara katılım için yaş sınırı var mı?",
    answer:
      "13 yaş ve üzeri oyuncular offline turnuvalara sorunsuz katılım gösterebilirler.",
  },
  {
    question:
      "Kafe turnuvasına takım arkadaşlarım kafeden katılsa, ben evden katılsam olur mu?",
    answer: "Maalesef. Tüm oyuncuların kafede yer alması gerekmektedir.",
  },
  {
    question: "Platformda yalnızca offline turnuvalar mı olacak?",
    answer:
      "Online turnuvalar sayfasından platformumuzdaki online turnuvaları görebilirsiniz.",
  },
] as const;

const pointValues = [
  { points: "24K", tl: 120 },
  { points: "50K", tl: 250 },
  { points: "100K", tl: 500 },
  { points: "170K", tl: 850 },
  { points: "246K", tl: 1230 },
  { points: "490K", tl: 2450 },
] as const;

export default function SSSPage() {
  const [selectedPoints, setSelectedPoints] = useState(0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-optimi-dark">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[350px] overflow-hidden">
        <Image
          src="/img/sss-hero.jpg"
          alt="S.S.S Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-optimi-dark/60 via-optimi-dark/40 to-optimi-dark" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            S.S.S
          </h1>
          <p className="text-muted-foreground text-lg">Sıkça Sorulan Sorular</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="p-6 bg-optimi-darker rounded-xl border border-border hover:border-optimi-yellow/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {item.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.hasVideoLink ? (
                  <>
                    Turnuva kayıt rehberi{" "}
                    <Link
                      href="#"
                      className="text-optimi-yellow hover:underline"
                    >
                      videomuzu inceleyerek
                    </Link>{" "}
                    turnuvalarımıza kolayca kayıt olabilirsiniz.
                  </>
                ) : (
                  item.answer
                )}
              </p>
            </div>
          ))}
        </div>

        {/* OPTIMI Points Değerleri */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            OPTIMI Points Değerleri
          </h2>

          <div className="bg-optimi-darker rounded-xl border border-border p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Points Selection */}
              <div>
                <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  OPTIMI POINTS
                </p>
                <div className="flex flex-wrap gap-2">
                  {pointValues.map((item, idx) => (
                    <button
                      key={item.points}
                      onClick={() => setSelectedPoints(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPoints === idx
                          ? "bg-optimi-yellow text-optimi-dark"
                          : "bg-optimi-dark border border-border text-muted-foreground hover:border-optimi-yellow/50"
                      }`}
                    >
                      {item.points}
                    </button>
                  ))}
                </div>
              </div>

              {/* TL Value */}
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                  TÜRK LİRASI DEĞERİ
                </p>
                <p className="text-5xl md:text-6xl font-bold text-optimi-yellow">
                  ₺{pointValues[selectedPoints].tl}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hâlâ sorularınız mı var? */}
        <section className="bg-optimi-darker rounded-xl border border-border p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Hâlâ sorularınız mı var?
              </h3>
              <p className="text-muted-foreground">
                Aradığınız cevabı bulamıyor musunuz? Lütfen dost canlısı
                ekibimizle sohbet edin.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="flex-shrink-0 px-6 py-3 border border-foreground text-foreground rounded-lg font-medium hover:bg-foreground hover:text-optimi-dark transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
