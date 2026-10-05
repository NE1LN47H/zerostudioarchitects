import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "../data";
import JournalGrid from "../../components/JournalGrid";
import styles from "./article.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found — Zero Studio Architectures",
    };
  }

  return {
    title: `${article.title} — Zero Studio Architectures`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);

  return (
    <main id="main">
      <div className={styles.container}>
        <nav aria-label="Breadcrumb">
          <Link href="/journal" className={styles.backLinkTop}>
            ← Back to Journal
          </Link>
        </nav>

        <article>
          <header className={styles.header}>
            <div className={styles.category}>{article.category}</div>
            <h1 className={styles.title}>{article.title}</h1>
            <time className={styles.date}>{article.date}</time>
          </header>

          <div className={styles.featuredImageWrap}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1100px) 100vw, 1100px"
              className={styles.featuredImage}
            />
          </div>

          <div className={styles.contentWrapper}>
            <p className={styles.leadParagraph}>{article.content.intro}</p>

            {article.content.paragraphs.map((p, index) => (
              <p key={index} className={styles.bodyParagraph}>
                {p}
              </p>
            ))}

            {article.content.secondaryImage && (
              <figure className={styles.secondaryMedia}>
                <div className={styles.secondaryImageWrap}>
                  <Image
                    src={article.content.secondaryImage}
                    alt={article.content.secondaryImageCaption || article.title}
                    fill
                    sizes="(max-width: 740px) 100vw, 740px"
                    className={styles.secondaryImage}
                  />
                </div>
                {article.content.secondaryImageCaption && (
                  <figcaption className={styles.caption}>
                    {article.content.secondaryImageCaption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          <footer className={styles.articleFooter}>
            <Link href="/journal" className={styles.backLinkBottom}>
              ← Back to Journal
            </Link>
          </footer>
        </article>

        {relatedArticles.length > 0 && (
          <section className={styles.relatedSection} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.relatedHeading}>
              Related Journal
            </h2>
            <JournalGrid articles={relatedArticles} />
          </section>
        )}
      </div>
    </main>
  );
}
