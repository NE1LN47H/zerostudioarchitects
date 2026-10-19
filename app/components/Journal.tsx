"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./Journal.module.css";
import { MediaPublication } from "@/types";
import { INITIAL_PUBLICATIONS } from "@/lib/data/initialPublications";

interface JournalCardData {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}

interface MediaSectionProps {
  articles?: JournalCardData[];
  publications?: MediaPublication[];
}

const PLATFORMS = [
  "All",
  "Archdaily",
  "Architect and Interiors India",
  "Designboom",
  "Buildofy",
  "YouTube",
  "Others",
];

export default function MediaSection({
  publications = [],
}: MediaSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  // Fallback to seeded initial publications if database returned empty
  const allPublications = useMemo(() => {
    if (publications && publications.length > 0) {
      return publications.filter((p) => p.visible);
    }
    return INITIAL_PUBLICATIONS.filter((p) => p.visible);
  }, [publications]);

  const filteredItems = useMemo(() => {
    if (selectedPlatform === "All") return allPublications;
    return allPublications.filter((p) => p.platform === selectedPlatform);
  }, [allPublications, selectedPlatform]);

  return (
    <section id="media" aria-labelledby="media-title" className={styles.section}>
      <div className={styles.wrap}>
        {/* Editorial Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="media-title" className={styles.title}>
              In the Media
            </h2>
            <p className={styles.subtitle}>
              Selected list of works published at national &amp; international platforms
            </p>
          </div>

          <Link href="/media" className={styles.headerLink}>
            <span>Dedicated Page</span>
            <span className={styles.linkArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Platform Filter Tabs */}
        <div className={styles.filterRow} role="tablist" aria-label="Filter by publication platform">
          {PLATFORMS.map((plat) => {
            const count =
              plat === "All"
                ? allPublications.length
                : allPublications.filter((p) => p.platform === plat).length;

            return (
              <button
                key={plat}
                type="button"
                role="tab"
                aria-selected={selectedPlatform === plat}
                className={`${styles.filterBtn} ${selectedPlatform === plat ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedPlatform(plat)}
              >
                {plat} ({count})
              </button>
            );
          })}
        </div>

        {/* Publication Links Directory */}
        <div className={styles.listWrap} role="region" aria-label="Publications list">
          {filteredItems.map((item) => {
            if (item.url) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pubRow}
                  title={`Open ${item.title} on ${item.platform}`}
                >
                  <div className={styles.pubMain}>
                    <div className={styles.pubHeader}>
                      <span className={styles.platformBadge}>{item.platform}</span>
                      {item.project && <span className={styles.pubProject}>{item.project}</span>}
                      <span className={styles.pubYear}>{item.year}</span>
                    </div>

                    <h3 className={styles.pubTitle}>{item.title}</h3>

                    {item.description && (
                      <p className={styles.pubDesc}>{item.description}</p>
                    )}

                    <span className={styles.pubUrl}>{item.url}</span>
                  </div>

                  <div className={styles.pubAction}>
                    <span>Read</span>
                    <span className={styles.arrowExternal} aria-hidden="true">↗</span>
                  </div>
                </a>
              );
            }

            return (
              <div key={item.id} className={styles.pubRow}>
                <div className={styles.pubMain}>
                  <div className={styles.pubHeader}>
                    <span className={styles.platformBadge}>{item.platform}</span>
                    {item.project && <span className={styles.pubProject}>{item.project}</span>}
                    <span className={styles.pubYear}>{item.year}</span>
                  </div>

                  <h3 className={styles.pubTitle}>{item.title}</h3>

                  {item.description && (
                    <p className={styles.pubDesc}>{item.description}</p>
                  )}
                </div>

                <span className={styles.printBadge}>Print Edition</span>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <p style={{ color: "#888", fontSize: "0.85rem", padding: "20px 0" }}>
              No publications found under this category.
            </p>
          )}
        </div>

        {/* Section Footer */}
        <div className={styles.footerRow}>
          <span className={styles.countLabel}>
            Showing {filteredItems.length} of {allPublications.length} Published Features
          </span>

          <Link href="/media" className={styles.viewAllDedicated}>
            <span>Open Dedicated Page</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}