import type { Metadata } from "next";
import {
  SITE_NAME,
  DEFAULT_SITE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
  PRIMARY_KEYWORDS,
  getSiteUrl,
} from "./config";

export * from "./config";
export * from "./structuredData";

export interface MetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
}

export function constructMetadata({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  path = "",
  image = "/ZERO-LOGO-ORIGINAL.png",
  noIndex = false,
  keywords = PRIMARY_KEYWORDS,
  type = "website",
}: MetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  
  // Subpages get title with template fallback; Root page gets the full targeted default
  const pageTitle = title ? title : DEFAULT_SITE_TITLE;
  const ogImageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: title
      ? {
          default: pageTitle,
          template: `%s | ${SITE_NAME}`,
        }
      : {
          default: DEFAULT_SITE_TITLE,
          template: `%s | ${SITE_NAME}`,
        },
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || undefined,
    },
  };
}
