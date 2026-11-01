"use client";

import { useMemo } from "react";
import Link from "next/link";
import styles from "./AwardsPreview.module.css";
import type { AwardItem } from "@/types";

interface AwardsProps {
  awards?: AwardItem[];
}

export default function Awards({ awards = [] }: AwardsProps) {
  // 6 curated awards dynamically sourced from MongoDB
  const curatedList = useMemo(() => {
    const curatedOnly = awards.filter((a) => a.curated);
    const selected = curatedOnly.length >= 6 ? curatedOnly.slice(0, 6) : awards.slice(0, 6);
    return selected.map((item, idx) => ({
      id: item.id,
      number: item.number || `0${idx + 1}`,
      award: item.award,
      project: item.project,
      organization: item.organization,
      category: item.category,
      year: item.year,
    }));
  }, [awards]);

  return (
    <section className={styles.awardsSection} id="awards" aria-labelledby="awards-title">
      <div className={styles.container}>
        {/* Understated Editorial Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="awards-title" className={styles.heading}>
              Recognition
            </h2>
          </div>
        </div>

        {/* Top Horizontal Thin Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* 3x2 Editorial Grid */}
        <div className={styles.grid}>
          {curatedList.map((item) => (
            <article key={item.id || item.number} className={styles.awardItem}>
              <div>
                <div className={styles.itemTop}>
                  <span className={styles.number}>{item.number}</span>
                  <span className={styles.year}>{item.year}</span>
                </div>
                <h3 className={styles.awardName}>{item.award}</h3>
                <p className={styles.projectName}>{item.project}</p>
              </div>
              <p className={styles.organization}>
                {item.organization} · {item.category}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom Horizontal Thin Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Bottom Right: Direct Link to Recognition Page (No Modals) */}
        <div className={styles.footerRow}>
          <Link href="/awards" className={styles.viewAllLink}>
            <span>VIEW ALL RECOGNITION</span>
            <span className={styles.arrowIcon} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
