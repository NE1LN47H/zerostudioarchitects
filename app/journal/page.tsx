import type { Metadata } from "next";
import { getAllArticles } from "./data";
import JournalGrid from "../components/JournalGrid";
import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "Journal — Zero Studio Architectures",
  description: "Thoughts, observations and stories from our practice.",
};

export default function JournalPage() {
  const articles = getAllArticles();

  return (
    <main id="main">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Journal</h1>
          <p className={styles.description}>
            Thoughts, observations and stories from our practice.
          </p>
        </header>

        <div className={styles.separator} aria-hidden="true" />

        <JournalGrid articles={articles} />
      </div>
    </main>
  );
}
