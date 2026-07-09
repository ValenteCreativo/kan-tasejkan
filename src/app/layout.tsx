import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/ui/Navigation";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Mindfulverso — Bienestar Universal",
  description: "Un espacio para cultivar bienestar, conciencia y transformación. Centro holístico con psicoterapia, mindfulness, ceremonias, círculos y más.",
  icons: {
    icon: '/isotipo.png',
    apple: '/isotipo.png',
  },
  openGraph: {
    title: "Mindfulverso — Bienestar Universal",
    description: "Un espacio para cultivar bienestar, conciencia y transformación.",
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
