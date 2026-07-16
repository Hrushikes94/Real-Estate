import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gravity Estates | Luxury Architectural Residences",
  description: "Explore Gravity Estates, an award-winning collection of contemporary minimalist residences, coastal penthouses, and modern cliffside pavilions.",
  keywords: ["luxury real estate", "modern homes", "minimalist architecture", "coastal penthouses", "gravity estates"],
  authors: [{ name: "Gravity Estates Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased cursor-none-desktop`}
    >
      <body className="min-h-full flex flex-col font-sans bg-off-white text-primary">
        <Preloader />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
