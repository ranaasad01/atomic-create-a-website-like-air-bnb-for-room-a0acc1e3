import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StayEase — Find Your Perfect Stay",
  description:
    "Discover and book unique rooms, houses, and hostels around the world. StayEase connects travelers with hosts for unforgettable stays.",
  keywords: ["rental", "accommodation", "rooms", "houses", "hostels", "travel", "booking"],
  openGraph: {
    title: "StayEase — Find Your Perfect Stay",
    description: "Discover and book unique rooms, houses, and hostels around the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}