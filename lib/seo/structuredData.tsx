import React from "react";
import { getSiteUrl } from "./index";
import { Project } from "@/types";

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ArchitecturalService",
    "@id": `${siteUrl}/#organization`,
    name: "Zero Studio",
    url: siteUrl,
    logo: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    image: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    description:
      "Zero Studio designs homes, cultural spaces and workplaces with clear plans and honest materials.",
    founder: [
      {
        "@type": "Person",
        name: "Hamid MM",
      },
      {
        "@type": "Person",
        name: "Hafeef PK",
      },
    ],
    foundingDate: "2013",
    address: {
      "@type": "PostalAddress",
      streetAddress: "#1/3793, East hill Road, Nadakkave",
      addressLocality: "Kozhikode",
      addressRegion: "Kerala",
      postalCode: "673006",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9447751826",
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
    name: "Zero Studio",
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
      name: "Zero Studio",
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

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
