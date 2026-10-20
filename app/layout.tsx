import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import SmoothScroll from "./components/SmoothScroll";
import { SectionProvider } from "./context/SectionContext";
import { constructMetadata } from "@/lib/seo";
import { JsonLd, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/structuredData";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
      </head>
      <body>
        <Preloader />
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
