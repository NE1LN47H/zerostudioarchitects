export interface JournalContent {
  intro: string;
  paragraphs: string[];
  secondaryImage?: string;
  secondaryImagePublicId?: string;
  secondaryImageCaption?: string;
}

// Backwards-compatibility alias for previous data.ts interface
export type ArticleContent = JournalContent;

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
