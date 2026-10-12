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
