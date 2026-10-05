import { JournalArticle } from "../journal/data";
import JournalCard from "./JournalCard";
import styles from "./JournalGrid.module.css";

interface JournalGridProps {
  articles: JournalArticle[];
}

export default function JournalGrid({ articles }: JournalGridProps) {
  return (
    <div className={styles.grid}>
      {articles.map((article, idx) => (
        <JournalCard key={article.slug} article={article} priority={idx < 3} />
      ))}
    </div>
  );
}
