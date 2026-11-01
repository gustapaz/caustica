import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CÁUSTICA — Um raio. Todos os caminhos.",
  description: "Luz, vidro e cor em um laboratório óptico interativo.",
  metadataBase: new URL("https://caustica-gustapaz.starrylinen.chatgpt.site"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "CÁUSTICA",
    description: "Luz, vidro e cor em um laboratório óptico interativo.",
    type: "website",
    locale: "pt_BR",
  },
  icons: { icon: "/favicon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
