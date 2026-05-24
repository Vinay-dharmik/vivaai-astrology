import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StarBackground } from "@/components/ui/StarBackground";
import { StickyBottomCTA } from "@/components/ui/StickyBottomCTA";
import { AdSenseScript } from "@/components/ui/AdBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "VivaAI Astrology — Free Vedic Kundali & AI Astrology",
  description:
    "Get your free AI-powered Vedic Kundali with accurate Lagna, Nakshatra, Dasha & remedies. Daily horoscope, kundali matching, zodiac compatibility & personalized astrology insights at vivaai.in. Trusted by thousands across India.",
  metadataBase: new URL("https://vivaai.in"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "VivaAI Astrology — Free Vedic Kundali & AI Astrology",
    description: "AI-powered Vedic astrology. Free Kundali, horoscopes, compatibility & remedies. Accurate birth charts trusted by thousands.",
    siteName: "VivaAI Astrology",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
  verification: {
    // Add your Google Search Console verification when ready
    // google: "your-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VivaAI Astrology",
    url: "https://vivaai.in",
    description: "Free AI-powered Vedic Kundali, daily horoscope, compatibility matching & personalized astrology insights.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vivaai.in/horoscope/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VivaAI Astrology",
    url: "https://vivaai.in",
    logo: "https://vivaai.in/favicon.svg",
    sameAs: [],
  };

  return (
    // suppressHydrationWarning prevents errors from browser extensions modifying <html>
    <html lang="en" className={`dark ${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffb347" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Google Analytics — replace GA_MEASUREMENT_ID with your actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
        {/* Google AdSense verification */}
        <meta name="google-adsense-account" content="ca-pub-7765519118524870" />
      </head>
      <body className="cosmic-bg min-h-screen antialiased font-sans">
        <AdSenseScript />
        <StarBackground />
        <Navbar />
        <main className="relative z-10 pt-16">{children}</main>
        <Footer />
        <StickyBottomCTA />
      </body>
    </html>
  );
}
