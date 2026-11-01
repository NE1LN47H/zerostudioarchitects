/**
 * Zero Studio Architects — Centralized SEO Configuration
 * Single source of truth for metadata, canonical URLs, geo-targeting, and keywords.
 */

export const SITE_NAME = "Zero Studio";

export const PRIMARY_KEYWORDS = [
  "best architects in kozhikode",
  "architects in calicut",
  "architecture firms in kerala",
  "zero studio architects",
  "tropical modern architecture kerala",
  "sustainable residential architects calicut",
  "contemporary house design kerala",
  "vernacular architecture calicut",
  "commercial architects kozhikode",
  "interior architects calicut",
];

export const DEFAULT_SITE_TITLE =
  "Zero Studio | Best Architects in Kozhikode (Calicut), Kerala";

export const DEFAULT_SITE_DESCRIPTION =
  "Zero Studio is an award-winning architecture and design practice in Kozhikode (Calicut), Kerala. Founded in 2013, creating context-driven residences, cultural spaces, and workplaces rooted in climate and honest materials.";

export const STUDIO_GEO = {
  name: "Zero Studio Architects",
  telephone: "+91 80894 44555",
  email: "mail@zerostudio.org",
  streetAddress: "#1/3793, East hill Road, Chakkorathukulam, Eranhippalam P.O, Nadakkave",
  addressLocality: "Kozhikode",
  addressRegion: "Kerala",
  postalCode: "673006",
  addressCountry: "IN",
  latitude: 11.2783,
  longitude: 75.7828,
  priceRange: "$$$",
  areaServed: ["Kozhikode", "Calicut", "Kerala", "India"],
  foundingDate: "2013",
  instagramUrl: "https://www.instagram.com/zerostudioofficial",
  facebookUrl: "https://www.facebook.com/zerostudioofficial/",
};

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://zerostudio.in";
  return url.replace(/\/+$/, "");
}

