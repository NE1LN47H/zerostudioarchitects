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
