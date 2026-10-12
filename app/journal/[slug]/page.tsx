import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getJournalArticles } from "@/services";
import JournalGrid from "../../components/JournalGrid";
import styles from "./article.module.css";
import { constructMetadata } from "@/lib/seo";
import { JsonLd, getArticleJsonLd } from "@/lib/seo/structuredData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return constructMetadata({
      title: "Article Not Found",
      path: `/journal/${slug}`,
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${article.title} — Journal`,
    description: article.excerpt,
    path: `/journal/${article.slug}`,
    image: article.image,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getJournalArticles(true);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={getArticleJsonLd(article)} />
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
              <JournalGrid articles={relatedArticles as any} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
