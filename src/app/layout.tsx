import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <ClerkProvider
          telemetry={{ disabled: true }}
          appearance={{
            variables: {
              colorPrimary: "#DA0B2A",
            },
          }}
        >
          <Toaster />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
