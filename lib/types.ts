export interface CloudinaryAsset {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface HeroItem {
  id: string;
  image: string;
  imagePublicId?: string;
  title: string;
  category: string;
  year: string;
  meta: string;
  projectSlug?: string;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectGalleryItem {
  src: string;
  publicId?: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'wide';
  layout?: 'full' | 'wide' | 'half' | 'large' | 'portrait';
  order?: number;
}

export interface ProjectNarrativeSection {
  heading: string;
  paragraphs: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  editorialIntro?: string;
  category: string;
  year: string;
  location: string;
  area: string;
  client?: string;
  leadArchitects?: string;
  photography: string;
  awards?: string[];
  heroImage: string;
  heroImagePublicId?: string;
  summary: string;
  narrative: ProjectNarrativeSection[];
  gallery: ProjectGalleryItem[];
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutContent {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  leadArchitects?: string;
  stats?: { label: string; value: string }[];
  updatedAt?: string;
}

export interface AwardItem {
  id: string;
  number?: string;
  award: string;
  project: string;
  organization: string;
  category: string;
  year: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  order: number;
  curated: boolean; // Shown on homepage preview
  visible: boolean;
  type: 'curated' | 'project' | 'honor';
  updatedAt?: string;
}

export interface JournalContent {
  intro: string;
  paragraphs: string[];
  secondaryImage?: string;
  secondaryImagePublicId?: string;
  secondaryImageCaption?: string;
}

export interface JournalArticle {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  imagePublicId?: string;
  author?: string;
  content: JournalContent;
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  imagePublicId?: string;
  bio?: string;
  order: number;
  visible: boolean;
  updatedAt?: string;
}

export interface ContactInfo {
  heading: string;
  lead: string;
  emailGeneral: string;
  emailJobs: string;
  phone: string;
  address: string;
  mapLink: string;
  instagramUrl: string;
  facebookUrl: string;
  updatedAt?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl?: string;
  defaultOgImage?: string;
  instagramUrl: string;
  facebookUrl: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  originalFilename?: string;
  sizeBytes?: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}
