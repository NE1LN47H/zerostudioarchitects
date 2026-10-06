import Link from "next/link";
import Image from "next/image";
import styles from "./Journal.module.css";

interface JournalCardData {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}

interface JournalProps {
  articles?: JournalCardData[];
}

export default function Journal({ articles = [] }: JournalProps) {
  const featuredOnly = articles.filter((a) => a.featured);
  const displayArticles = featuredOnly.length >= 3 ? featuredOnly.slice(0, 3) : articles.slice(0, 3);

  return (
    <section id="journal" aria-labelledby="journal-title" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="journal-title" className={styles.title}>
              Journal
            </h2>
            <p className={styles.subtitle}>
              Notes on process, materials and places we&apos;ve worked.
            </p>
          </div>

          <Link href="/journal" className={styles.headerLink}>
            <span>View all</span>
            <span className={styles.linkArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {displayArticles.map((article) => (
            <article key={article.slug} className={styles.card}>
              <Link href={`/journal/${article.slug}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardMeta}>
                  {article.category} · {article.date}
                </p>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.footRow}>
          <Link href="/journal" className={styles.viewAllBtn}>
            <span>View all journal</span>
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}