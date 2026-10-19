export interface MediaPublication {
  id: string;
  title: string;
  platform: string; // Archdaily, Architect and Interiors India, Designboom, Buildofy, YouTube, Others
  project?: string;
  url?: string;
  year: string;
  format?: string; // Online Feature, Video, Print, Interview, Publication
  description?: string;
  image?: string;
  imagePublicId?: string;
  order: number;
  curated: boolean; // Shown on homepage Section 05
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}
