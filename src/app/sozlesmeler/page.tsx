import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/shared";

export const metadata: Metadata = {
  title: "Kullanıcı Sözleşmeleri | OPTIMI",
  description:
    "OPTIMI üyelik ve hizmet sözleşmesi, kişisel verilerin korunması politikası ve gizlilik hükümleri.",
};

export default function SozlesmelerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-optimi-dark pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Başlık */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
          OPTIMI ÜYELİK VE HİZMET SÖZLEŞMESİ
        </h1>

        {/* Madde 1 */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-optimi-yellow mb-4">
            Madde 1– Sözleşmenin Tarafları
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">1.1.</span> İşbu
            sözleşme bir tarafta &quot;
            <Link
              href="https://optimi.gg/"
              className="text-optimi-yellow hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://optimi.gg/
            </Link>
            &quot; (Bundan böyle OPTIMI-Web Site-Sağlayıcı olarak anılacaktır)
            ile diğer tarafta OPTIMI web sitesinden işbu sözleşmede belirtilen
            koşullar dahilinde yararlanan Kullanıcı/lar arasında aşağıda yazılı
            şartlar dahilinde akdedilmiştir.
          </p>
        </section>

        {/* Madde 2 */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-optimi-yellow mb-4">
            Madde 2– Taraflara İlişkin Bilgiler
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground mb-3">
              2.1 Web Site-Sağlayıcı-OPTIMI
            </h3>
            <div className="space-y-2 text-muted-foreground pl-4 border-l-2 border-optimi-yellow/30">
              <p>
                <span className="text-foreground font-medium">Adı:</span>{" "}
                optimi.gg (Gö*** Bu****** Ka*** adına şahıs şirketi)
              </p>
              <p>
                <span className="text-foreground font-medium">Adresi:</span>{" "}
                Bulancak/Giresun
              </p>
              <p>
                <span className="text-foreground font-medium">
                  E-Posta Adresi:
                </span>{" "}
                <a
                  href="mailto:info@optimi.gg"
                  className="text-optimi-yellow hover:underline"
                >
                  info@optimi.gg
                </a>
              </p>
              <p>
                <span className="text-foreground font-medium">
                  Vergi Kimlik No:
                </span>{" "}
                4850540041(Bulancak/Giresun Vergi Dairesi)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground mb-3">
              2.2 Kullanıcının
            </h3>
            <p className="text-muted-foreground pl-4 border-l-2 border-optimi-yellow/30">
              <span className="text-foreground font-medium">
                Adı/Soy Adı, Doğum Tarihi, Adresi, Telefon Numarası, E-Posta
                Adresi, Banka Hesap Bilgileri
              </span>{" "}
              <span className="text-optimi-yellow/80">
                (Kullanıcılar kayıt aşamasında verdiği bilgilere göre
                sözleşmenin bu bölümüne eklenecektir.)
              </span>
            </p>
          </div>

          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">2.3</span> Her iki
              taraf, 2.1. ve 2.2. maddelerinde belirtilen adreslerini tebligat
              adresi olarak kabul etmişlerdir. Adres değişiklikleri usulüne
              uygun şekilde karşı tarafa tebliğ edilmedikçe, en son bildirilen
              adrese yapılacak tebliğ, ilgili tarafa yapılmış sayılır. Kullanıcı
              hesabının ortak girişim olması durumunda, pilot ortak veya
              koordinatör ortağa yapılan tebligatlar ortak girişimi oluşturan
              bütün ortaklara yapılmış sayılır.
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">2.4.</span>{" "}
              Taraflar, yazılı tebligatı daha sonra süresi içinde yapmak
              kaydıyla, kurye, faks veya elektronik posta gibi diğer yollarla da
              bildirim yapabilirler.
            </p>
          </div>
        </section>

        {/* Madde 3 */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-optimi-yellow mb-4">
            Madde 3- Sözleşmenin Dili
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">3.1</span> Sözleşmenin
            dili Türkçe&apos;dir. Web site ve arama motorlarının imkanları
            dahilinde başka dillere çeviri yapılması mümkündür. Ancak çeviri ve
            Ana Dil (Türkçe) arasında oluşabilecek ihtilaflarda Ana Dil (Türkçe)
            geçerli olacaktır.
          </p>
        </section>

        {/* Madde 4 */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-optimi-yellow mb-4">
            Madde 4- Tanımlar
          </h2>

          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">4.1</span> Bu
              sözleşmenin uygulanmasında aşağıdaki tanımlar geçerlidir:
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">4.2 OPTIMI:</span>{" "}
              optimi.gg web adresi (Bundan sonra OPTIMI olarak anılacaktır.)
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">
                4.3 İnternet/Web Sitesi:
              </span>{" "}
              &quot;
              <Link
                href="https://optimi.gg/"
                className="text-optimi-yellow hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://optimi.gg/
              </Link>
              &quot; adlı internet sitesi,
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">4.4 Uygulama:</span>{" "}
              İnternet sitesi üzerinden sunulan tüm hizmetler (Bundan sonra
              &quot;Uygulama&quot; olarak anılacaktır.)
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">4.5 Kullanıcı:</span>{" "}
              Uygulamadan OPTIMI tarafından sunulan hizmetlerden işbu sözleşmede
              belirtilen koşullar dahilinde yararlanan kişi/ler,
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">
                4.6 İletişim Kanalları:
              </span>{" "}
              Web Site Canlı Destek Bölümü, Anında bildirim, E-Posta, SMS, MMS,
              telefon ile bildirim gibi iletişime elverişli araçlar,
            </p>
            <p className="leading-relaxed">
              <span className="text-foreground font-medium">4.7 Üye:</span>{" "}
              Siteyi kullanma amacıyla kayıt olan, OPTIMI tarafından kendisinden
              istenilen kişisel verilerini açık rızası ile kabul edip onaylayarak
              kendisine şifre ve kullanıcı adı belirleyen kişi olarak
              anılacaktır.
            </p>
          </div>
        </section>

        {/* Diğer Belgeler */}
        <section className="mt-12 p-6 bg-optimi-darker rounded-xl border border-border">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Üyelik ve Hizmet Sözleşmesi&apos;nin tamamına{" "}
            <Link
              href="/sozlesmeler/uyelik-hizmet"
              className="text-optimi-yellow hover:underline font-medium"
            >
              buradan
            </Link>{" "}
            ulaşabilirsiniz.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Kişisel Verilerin Korunması ve İşlenmesi Politikası&apos;na{" "}
            <Link
              href="/sozlesmeler/kvkk"
              className="text-optimi-yellow hover:underline font-medium"
            >
              buradan
            </Link>{" "}
            ulaşabilirsiniz.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Gizlilik Hükümleri&apos;ne{" "}
            <Link
              href="/sozlesmeler/gizlilik"
              className="text-optimi-yellow hover:underline font-medium"
            >
              buradan
            </Link>{" "}
            ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
