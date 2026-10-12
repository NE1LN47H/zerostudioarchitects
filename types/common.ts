export interface CloudinaryAsset {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
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
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: string;
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
