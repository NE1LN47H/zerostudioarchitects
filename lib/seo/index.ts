import type { Metadata } from "next";

export const DEFAULT_SITE_TITLE = "Zero Studio Architectures";
export const DEFAULT_SITE_DESCRIPTION =
  "Zero Studio Architectures is an architecture practice based in Calicut, Kerala. Rooted in context, climate and material truth, designing residences, cultural spaces and workplaces.";

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://zerostudio.in";
  return url.replace(/\/+$/, "");
}

export interface MetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  path = "",
  image = "/ZERO-LOGO-ORIGINAL.png",
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title ? `${title} — ${DEFAULT_SITE_TITLE}` : DEFAULT_SITE_TITLE;
  const ogImageUrl = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: DEFAULT_SITE_TITLE,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
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
  };
}
