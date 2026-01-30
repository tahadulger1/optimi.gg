import { Metadata } from "next";

export const metadata: Metadata = {
  title: "S.S.S - Sıkça Sorulan Sorular | OPTIMI",
  description:
    "OPTIMI turnuvaları, OPTIMI Points ve platform hakkında sıkça sorulan sorular ve cevapları.",
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
