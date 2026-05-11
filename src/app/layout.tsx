import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Burratina - Quesos Artesanales Italianos",
  description: "Línea artesanal de quesos frescos italianos: Mozzarella Fiordilatte, Burrata Premium y Mascarpone Exclusivo. Tradición artesanal con la mejor calidad.",
  keywords: ["La Burratina", "quesos artesanales", "mozzarella", "burrata", "mascarpone", "bocconcini", "quesos italianos", "pasta filata"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧀</text></svg>",
  },
  openGraph: {
    title: "La Burratina - Quesos Artesanales",
    description: "Quesos artesanales italianos de primera calidad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
