import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Outfit({
  variable: "--font-inter", 
  subsets: ["latin"],
});

const fontDisplay = Plus_Jakarta_Sans({
  variable: "--font-poppins", // keep the same variable name to avoid editing DashboardClient.tsx
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wavebot.id"),
  title: {
    default: "WaveBot - Infrastruktur WhatsApp API Gateway & AI Chatbot Terdepan",
    template: "%s | WaveBot"
  },
  description: "Platform WhatsApp API Gateway & Chatbot modern untuk bisnis di Indonesia. Integrasikan notifikasi otomatis, broadcast OTP massal, auto-reply cerdas, dan AI chatbot tanpa ribet.",
  keywords: [
    "WhatsApp Gateway",
    "WhatsApp API Indonesia",
    "WA Gateway Murah",
    "WhatsApp Bot",
    "Broadcast WhatsApp",
    "Kirim Pesan Otomatis WhatsApp",
    "AI WhatsApp Chatbot",
    "Groq LLM WhatsApp",
    "Multi Device WhatsApp API",
    "Webhook WhatsApp",
    "Baileys API Gateway"
  ],
  authors: [{ name: "WaveBot Team", url: "https://wavebot.id" }],
  creator: "WaveBot",
  publisher: "WaveBot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WaveBot - Infrastruktur WhatsApp API Gateway & AI Chatbot Modern",
    description: "Kirim pesan otomatis, buat Auto-Reply cerdas, rancang Menu Interaktif, hingga integrasikan Chatbot AI ke sistem bisnis Anda dengan mudah dan cepat.",
    url: "https://wavebot.id",
    siteName: "WaveBot",
    images: [
      {
        url: "/Hero/DashboardPanelImageNew.png",
        width: 1920,
        height: 1080,
        alt: "WaveBot WhatsApp Gateway Dashboard & Architecture",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WaveBot - WhatsApp API Gateway & Bot Solution",
    description: "Solusi infrastruktur WhatsApp modern untuk bisnis. Dukungan Multi-Device, REST API, Webhook, dan AI Chatbot.",
    images: ["/Hero/DashboardPanelImageNew.png"],
    creator: "@wavebot",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/LogoNewNoBg.png",
    apple: "/LogoNewNoBg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "WaveBot",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    },
    "description": "Platform WhatsApp API Gateway & Chatbot modern untuk bisnis di Indonesia. Integrasikan notifikasi otomatis, broadcast OTP massal, auto-reply cerdas, dan AI chatbot.",
    "url": "https://wavebot.id",
    "author": {
      "@type": "Organization",
      "name": "WaveBot",
      "url": "https://wavebot.id",
      "logo": "https://wavebot.id/LogoNewNoBg.png"
    }
  };

  return (
    <html lang="id" className={`${font.variable} ${fontDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
