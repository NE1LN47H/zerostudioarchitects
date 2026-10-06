import type { Metadata } from "next";
import Link from "next/link";
import { getJournalArticles } from "@/lib/db/service";
import JournalGrid from "../components/JournalGrid";
import styles from "./journal.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Zero Studio Architectures",
  description: "Thoughts, observations and stories from our practice.",
};

export default async function JournalPage() {
  const articles = await getJournalArticles(true);

  return (
    <main id="main">
      <div className={styles.container}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#767676',
            textDecoration: 'none',
            marginBottom: '28px',
            transition: 'color 0.2s ease',
          }}
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>Journal</h1>
          <p className={styles.description}>
            Thoughts, observations and stories from our practice.
          </p>
        </header>

        <div className={styles.separator} aria-hidden="true" />

        <JournalGrid articles={articles as any} />
      </div>
    </main>
  );
}
