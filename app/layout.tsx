import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import { SectionProvider } from "./context/SectionContext";
import { constructMetadata } from "@/lib/seo";
import { JsonLd, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/structuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
      </head>
      <body>
        <SectionProvider>
          <SmoothScroll />
          <a className="skip" href="#main">Skip to content</a>
          <Header />
          {children}
          <Footer />
        </SectionProvider>
      </body>
    </html>
  );
}
