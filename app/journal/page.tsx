import type { Metadata } from "next";
import Link from "next/link";
import { getPublications } from "@/services";
import styles from "./journal.module.css";
import { constructMetadata } from "@/lib/seo";
import { MediaPublication } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "In the Media",
  description:
    "Selected list of works published at national & international platforms.",
  path: "/journal",
});

// Group publications by platform maintaining order
function groupByPlatform(
  pubs: MediaPublication[]
): Record<string, MediaPublication[]> {
  const groups: Record<string, MediaPublication[]> = {};
  for (const pub of pubs) {
    if (!groups[pub.platform]) {
      groups[pub.platform] = [];
    }
    groups[pub.platform].push(pub);
  }
  return groups;
}

export default async function InTheMediaPage() {
  const publications = await getPublications(true);
  const grouped = groupByPlatform(publications);

  // Maintain a consistent platform order
  const platformOrder = [
    "Archdaily",
    "Architect and Interiors India",
    "Designboom",
    "Buildofy",
    "YouTube",
    "Others",
  ];

  // Sort platforms: known ones first in order, then any unknown ones at the end
  const sortedPlatforms = Object.keys(grouped).sort((a, b) => {
    const idxA = platformOrder.indexOf(a);
    const idxB = platformOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <main id="main">
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>In the Media</h1>
          <p className={styles.description}>
            Selected list of works published at national &amp; international
            platforms
          </p>
        </header>

        <div className={styles.separator} aria-hidden="true" />

        <div className={styles.platformsList}>
          {sortedPlatforms.map((platform) => (
            <section key={platform} className={styles.platformGroup}>
              <h2 className={styles.platformName}>{platform}</h2>

              <ul className={styles.linksList}>
                {grouped[platform].map((pub) => (
                  <li key={pub.id} className={styles.linkItem}>
                    {pub.url ? (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.publicationLink}
                      >
                        <span className={styles.linkIcon}>↗</span>
                        <span className={styles.linkContent}>
                          <span className={styles.linkTitle}>{pub.title}</span>
                          {pub.description && (
                            <span className={styles.linkNote}>
                              {pub.description}
                            </span>
                          )}
                          <span className={styles.linkUrl}>{pub.url}</span>
                        </span>
                      </a>
                    ) : (
                      <div className={styles.publicationPrint}>
                        <span className={styles.printIcon}>◉</span>
                        <span className={styles.linkContent}>
                          <span className={styles.linkTitle}>{pub.title}</span>
                          {pub.description && (
                            <span className={styles.linkNote}>
                              {pub.description}
                            </span>
                          )}
                          <span className={styles.printLabel}>
                            Print / Offline
                          </span>
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
