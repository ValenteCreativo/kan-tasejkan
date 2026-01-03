import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "../components/ui/Navigation";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Martina - Sacred Geometry Art",
  description: "Contemporary art inspired by sacred geometry and ancient symbolism",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${cormorant.variable} antialiased sacred-bg`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
