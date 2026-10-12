import React from "react";
import { getSiteUrl } from "./index";
import { Project, JournalArticle } from "@/types";

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ArchitecturalService",
    "@id": `${siteUrl}/#organization`,
    name: "Zero Studio Architectures",
    alternateName: "Zero Studio",
    url: siteUrl,
    logo: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    image: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    description:
      "Zero Studio Architectures designs homes, cultural spaces and workplaces with clear plans and honest materials.",
    founder: [
      {
        "@type": "Person",
        name: "Hafeez",
      },
      {
        "@type": "Person",
        name: "Arjun",
      },
    ],
    foundingDate: "2013",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Eranhippalam P.O, Nadakkave",
      addressLocality: "Kozhikode",
      addressRegion: "Kerala",
      postalCode: "673006",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-808-678-0008",
      contactType: "customer service",
      email: "mail@zerostudio.org",
    },
    sameAs: [
      "https://www.instagram.com/zerostudioofficial",
      "https://www.facebook.com/zerostudioofficial/",
    ],
  };
}

export function getWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Zero Studio Architectures",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function getProjectJsonLd(project: Project) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;
  const imageUrl = project.heroImage.startsWith("http")
    ? project.heroImage
    : `${siteUrl}${project.heroImage.startsWith("/") ? project.heroImage : `/${project.heroImage}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": canonicalUrl,
    name: project.title,
    headline: project.subtitle || project.title,
    description: project.summary || project.subtitle,
    url: canonicalUrl,
    image: imageUrl,
    creator: {
      "@type": "Organization",
      name: "Zero Studio Architectures",
      url: siteUrl,
    },
    artMedium: "Architecture",
    artform: project.category || "Architecture",
    dateCreated: project.year,
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
  };
}

export function getArticleJsonLd(article: JournalArticle) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/journal/${article.slug}`;
  const imageUrl = article.image.startsWith("http")
    ? article.image
    : `${siteUrl}${article.image.startsWith("/") ? article.image : `/${article.image}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    image: imageUrl,
    datePublished: article.createdAt || article.date,
    dateModified: article.updatedAt || article.createdAt || article.date,
    author: {
      "@type": "Organization",
      name: article.author || "Zero Studio Architectures",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Zero Studio Architectures",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
      },
    },
    articleSection: article.category,
  };
}

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
