import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/ui/Navigation";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kan-Tasejkan — Lugar de Sombras | Ecoturismo Indígena en Veracruz",
  description: "Espacio ecoturístico indígena en Tonalapan, municipio de Mecayapan, Sierra Sur de Veracruz. Hospedaje en cabañas, restaurante, deportes de aventura, balneario, camping, talleres culturales y experiencias turísticas comunitarias.",
  icons: {
    icon: '/logo-nobg.png',
    apple: '/logo-nobg.png',
  },
  openGraph: {
    title: "Kan-Tasejkan — Lugar de Sombras",
    description: "Ecoturismo indígena en Tonalapan, municipio de Mecayapan, Sierra Sur de Veracruz. Vive experiencias auténticas en contacto con la naturaleza y la cultura ancestral.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased font-[family-name:var(--font-inter)]`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
