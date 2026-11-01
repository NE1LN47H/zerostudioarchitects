import React from "react";
import { getSiteUrl, STUDIO_GEO, SITE_NAME } from "./config";
import { Project } from "@/types";

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["ArchitecturalService", "ProfessionalService", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    alternateName: "Zero Studio Architects",
    url: siteUrl,
    logo: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    image: `${siteUrl}/ZERO-LOGO-ORIGINAL.png`,
    description:
      "Award-winning architectural studio in Kozhikode (Calicut), Kerala. Creating context-driven residences, cultural spaces and workplaces rooted in climate and honest materials.",
    telephone: STUDIO_GEO.telephone,
    email: STUDIO_GEO.email,
    priceRange: STUDIO_GEO.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO_GEO.streetAddress,
      addressLocality: STUDIO_GEO.addressLocality,
      addressRegion: STUDIO_GEO.addressRegion,
      postalCode: STUDIO_GEO.postalCode,
      addressCountry: STUDIO_GEO.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STUDIO_GEO.latitude,
      longitude: STUDIO_GEO.longitude,
    },
    areaServed: STUDIO_GEO.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    founder: [
      {
        "@type": "Person",
        name: "Hamid MM",
        jobTitle: "Founding Partner",
      },
      {
        "@type": "Person",
        name: "Hafeef PK",
        jobTitle: "Founding Partner",
      },
    ],
    employee: [
      {
        "@type": "Person",
        name: "Shabna K",
        jobTitle: "Principal Architect",
      },
      {
        "@type": "Person",
        name: "Nidhinraj KJ",
        jobTitle: "Principal Architect",
      },
    ],
    foundingDate: STUDIO_GEO.foundingDate,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: STUDIO_GEO.telephone,
      contactType: "customer service",
      email: STUDIO_GEO.email,
      availableLanguage: ["English", "Malayalam"],
    },
    sameAs: [
      STUDIO_GEO.instagramUrl,
      STUDIO_GEO.facebookUrl,
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
    name: SITE_NAME,
    description:
      "Architecture practice based in Kozhikode (Calicut), Kerala. Vernacular craft, climate responsive residences, and cultural spaces.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-IN",
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
    "@type": ["CreativeWork", "Place"],
    "@id": canonicalUrl,
    name: project.title,
    headline: project.subtitle || project.title,
    description: project.summary || project.subtitle,
    url: canonicalUrl,
    image: imageUrl,
    creator: {
      "@type": "ArchitecturalService",
      name: SITE_NAME,
      url: siteUrl,
      "@id": `${siteUrl}/#organization`,
    },
    dateCreated: project.year,
    locationCreated: {
      "@type": "Place",
      name: project.location || "Kerala, India",
    },
    genre: project.category || "Architecture",
    inLanguage: "en-IN",
  };
}

export function getBreadcrumbsJsonLd(items: Array<{ name: string; path: string }>) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
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
