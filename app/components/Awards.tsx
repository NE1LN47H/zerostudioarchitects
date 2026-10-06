"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./AwardsPreview.module.css";
import type { AwardItem } from "@/lib/types";

interface AwardsProps {
  awards?: AwardItem[];
}

export default function Awards({ awards = [] }: AwardsProps) {
  const [modalOpen, setModalOpen] = useState(false);

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

  // Group project recognitions dynamically from MongoDB for modal
  const projectRecognitions = useMemo(() => {
    const projectItems = awards.filter((a) => a.type === "project" || a.type === "curated" || !a.type);
    const map = new Map<string, { project: string; awards: string[] }>();
    for (const item of projectItems) {
      const existing = map.get(item.project);
      const citation = `${item.organization} - ${item.award}${item.category ? ` (${item.category})` : ""}`;
      if (existing) {
        existing.awards.push(citation);
      } else {
        map.set(item.project, {
          project: item.project,
          awards: [citation],
        });
      }
    }
    return Array.from(map.values());
  }, [awards]);

  // Dynamic studio honors from MongoDB for modal
  const studioHonors = useMemo(() => {
    return awards
      .filter((a) => a.type === "honor")
      .map((h) => `${h.year}: ${h.award}${h.organization ? ` - ${h.organization}` : ""}`);
  }, [awards]);

  return (
    <section className={styles.awardsSection} id="awards" aria-labelledby="awards-title">
      <div className={styles.container}>
        {/* Understated Editorial Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="awards-title" className={styles.heading}>
              Awards
            </h2>
            <span className={styles.subheading}>ZERO STUDIO (ESTD 2013)</span>
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

        {/* Bottom Right: Minimal Action Link */}
        <div className={styles.footerRow}>
          <button
            type="button"
            className={styles.viewAllLink}
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
          >
            <span>VIEW ALL AWARDS</span>
            <span className={styles.arrowIcon} aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Complete Archive Modal */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-awards-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="modal-awards-title" className={styles.modalTitle}>
                All Awards & Recognitions
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setModalOpen(false)}
                aria-label="Close awards archive"
              >
                CLOSE ✕
              </button>
            </div>

            <div>
              <h3 className={styles.modalSectionTitle}>Project Recognitions</h3>
              <ul className={styles.modalList}>
                {projectRecognitions.map((rec, idx) => (
                  <li key={idx} className={styles.modalItem}>
                    <h4 className={styles.modalProjectTitle}>{rec.project}</h4>
                    <ul className={styles.modalAwardSublist}>
                      {rec.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              {studioHonors.length > 0 && (
                <>
                  <h3 className={styles.modalSectionTitle}>Studio Honors</h3>
                  <ul className={styles.modalAwardSublist} style={{ marginBottom: "32px" }}>
                    {studioHonors.map((rec, i) => (
                      <li key={i} style={{ marginBottom: "8px" }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div style={{ textAlign: "right" }}>
                <Link
                  href="/awards"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    fontWeight: 500,
                  }}
                >
                  OPEN AS DEDICATED PAGE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}