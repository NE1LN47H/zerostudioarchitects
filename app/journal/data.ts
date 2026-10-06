// TypeScript Type Definitions for Zero Studio Journal
// (All journal articles are fetched dynamically from MongoDB - Single Source of Truth)

export interface ArticleContent {
  intro: string;
  paragraphs: string[];
  secondaryImage?: string;
  secondaryImageCaption?: string;
}

export interface JournalArticle {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: ArticleContent;
  featured?: boolean;
}
