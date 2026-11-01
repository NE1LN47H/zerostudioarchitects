import type { Metadata } from "next";
import Link from "next/link";
import { getAwards } from "@/services";
import { constructMetadata } from "@/lib/seo";
import styles from "./awards.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Recognition",
  description:
    "National and state architectural awards, citations and honors received by Zero Studio since 2013.",
  path: "/awards",
});

export default async function AwardsPage() {
  const dynamicAwards = await getAwards(true);

  // Group dynamic awards from MongoDB
  const projectItems = dynamicAwards.filter((a) => a.type === "project" || a.type === "curated" || !a.type);
  const honorItems = dynamicAwards.filter((a) => a.type === "honor");

  // Group by project name
  const groupedMap = new Map<string, { project: string; year: string; awards: string[] }>();
  for (const item of projectItems) {
    const existing = groupedMap.get(item.project);
    const citation = `${item.organization} - ${item.award}${item.category ? ` (${item.category})` : ""}`;
    if (existing) {
      existing.awards.push(citation);
    } else {
      groupedMap.set(item.project, {
        project: item.project,
        year: item.year,
        awards: [citation],
      });
    }
  }
  const projectHonors = Array.from(groupedMap.values());
  const studioCitations = honorItems.map((h) => `${h.year}: ${h.award}${h.organization ? ` - ${h.organization}` : ""}`);

  return (
    <main id="main">
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>Recognition</h1>
          <p className={styles.description}>
            A chronological archive of national and state recognitions, design citations, and architectural honors.
          </p>
        </header>

        <div className={styles.separator} aria-hidden="true" />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Honors</h2>
          <div className={styles.projectList}>
            {projectHonors.map((item, idx) => (
              <article key={idx} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectName}>{item.project}</h3>
                  <span className={styles.projectYear}>{item.year}</span>
                </div>
                <ul className={styles.awardList}>
                  {item.awards.map((award, i) => (
                    <li key={i} className={styles.awardListItem}>
                      {award}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {studioCitations.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Studio Citations &amp; Recognitions</h2>
            <ul className={styles.citationList}>
              {studioCitations.map((rec, i) => (
                <li key={i} className={styles.citationListItem}>
                  {rec}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
