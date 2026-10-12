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

export type ProjectDetail = Project;
export type ProjectGalleryImage = ProjectGalleryItem;
