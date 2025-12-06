import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "QuickCinema",
  description:
    "QuickCinema brings you the latest and most popular films in a clean, fast, and immersive browsing experience. Built with Next.js for blazing performance, QuickCinema helps you explore movies effortlessly through smart categories, real-time updates, and a sleek modern design. Your next favorite movie is just a click away.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${outfit.variable} antialiased`}>
          <Header />
          <Toaster />
          <main className="min-h-[calc(100vh-76px)]">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
