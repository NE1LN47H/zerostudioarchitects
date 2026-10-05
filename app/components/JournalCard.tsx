import Image from "next/image";
import Link from "next/link";
import { JournalArticle } from "../journal/data";
import styles from "./JournalCard.module.css";

interface JournalCardProps {
  article: JournalArticle;
  priority?: boolean;
}

export default function JournalCard({ article, priority = false }: JournalCardProps) {
  return (
    <article>
      <Link href={`/journal/${article.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
            priority={priority}
            className={styles.image}
          />
        </div>
        <div className={styles.category}>{article.category}</div>
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <time className={styles.date}>{article.date}</time>
      </Link>
    </article>
  );
}
