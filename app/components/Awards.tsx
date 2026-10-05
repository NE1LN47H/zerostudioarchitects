"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./AwardsPreview.module.css";

// 6 top curated awards for the architectural editorial preview fitting 100svh
const CURATED_AWARDS = [
  {
    number: "01",
    award: "Silver Leaf Award",
    project: "HAVEN, Kannur",
    organization: "Vanitha Veedu Architectural Awards",
    category: "Residential Interior",
    year: "2026",
  },
  {
    number: "02",
    award: "Best Young Architect from Kerala",
    project: "Ar. Hamid MM & Zero Studio Team",
    organization: "IIA National Awards for Excellence in Architecture",
    category: "Young Architect Award",
    year: "2024",
  },
  {
    number: "03",
    award: "Commendation Award",
    project: "Screen: The Lantern House, Tirur",
    organization: "IIA Kerala State Awards for Excellence",
    category: "Residential Interior",
    year: "2023",
  },
  {
    number: "04",
    award: "Winner — Landscape Design",
    project: "Reviving the Spirit of a Place (Quarry)",
    organization: "Kohler Bold Design Awards",
    category: "Responsible Architecture & Landscape",
    year: "2022",
  },
  {
    number: "05",
    award: "National Winner",
    project: "Edavani: Redefining a Tribal Hamlet",
    organization: "IIA National Awards for Excellence in Architecture",
    category: "Architecture Unbuilt",
    year: "2020",
  },
  {
    number: "06",
    award: "Special Commendation",
    project: "Kadalas: The Sea View Cafe, South Beach",
    organization: "Forbes India Design Awards",
    category: "Retail & Hospitality Interiors",
    year: "2019",
  },
];

// Complete approved awards dataset preserved in full
const ALL_RECOGNITIONS = [
  {
    project: "A Reminiscing Walk through Valiyangadi: history that is retained and revived, Malappuram, Kerala",
    awards: [
      "IIA-Royale State Awards for Excellence in Architecture 2013 - Golden Leaf Award",
      "IIA National Awards for Excellence in Architecture 2016 - Shortlisted"
    ]
  },
  {
    project: "The Temple of Knowledge: A Tribute to the father of Malayalam, Tirur, Kerala",
    awards: [
      "IIA- Kerala State Awards for Excellence in Architecture 2014 - Commendation",
      "IIA National Awards for Excellence in Architecture 2016 - Shortlisted - Architecture unbuilt"
    ]
  },
  {
    project: "Green Lattice - The Tower of Remembrance; Seethi Haji Memorial Cultural center, Malappuram, Kerala",
    awards: [
      "IIA- Kerala State Awards for Excellence in Architecture 2014 - Shortlisted",
      "Foundation for Architectural & Environmental awareness - Best Unbuilt Design 2014",
      "Archi Design awards for Excellence in Architecture 2015 - Winner",
      "Artist in Concrete Asia 2015-16 - Shortlisted",
      "IIA National Awards for Excellence in Architecture 2015 - Commendation for 'Architecture Unbuilt'"
    ]
  },
  {
    project: "Residence for Mr. Biju Mathew, Perinthalmanna, Kerala",
    awards: [
      "Vanitha Veedu architecture awards 2017: Award for Best Renovated House - Winner"
    ]
  },
  {
    project: "Mausam - The house of seasons",
    awards: [
      "Ace Architect - Ace Alpha Awards 2017: Winner - Residential-Affordable",
      "The Merit List 2018-19",
      "NDTV Design and Architecture Awards 2017 Nomination - Architecture Award-House"
    ]
  },
  {
    project: "Kadalas - The Sea view cafe, South Beach, Calicut, Kerala",
    awards: [
      "IIA National Awards For Excellence In Architecture 2018 - Shortlisted - Interior (Non-Residential)",
      "Forbes India Design Awards 2019: 'Best Retail & Hospitality Interiors' - Special Commendation",
      "The Merit List 2018-19",
      "IID Design Excellence Awards 2019 (Winner Zone 1) - Leisure & Entertainment",
      "IID Design Excellence Awards 2019: Runner up (National) - Leisure & Entertainment",
      "IIA Kerala state Awards for Excellence In Architecture 2021 - Commendation - Category Hospitality",
      "IIID Kerala regional chapter awards 2023 - Runner up - Category Leisure & Entertainment"
    ]
  },
  {
    project: "Reviving the spirit of a place - Story of An Abandoned Laterite Quarry",
    awards: [
      "IIA National Awards for Excellence in Architecture 2020 - Shortlisted - Landscape design - Category B",
      "IIA Kerala state Awards for Excellence in Architecture 2021 - Silver Leaf - Category: Responsible Architecture",
      "IIA Kerala state Awards for Excellence in Architecture 2021 - Gold Leaf - Category: Landscape B",
      "Kohler Bold Design Awards 2022 - Winner - Category: Landscape design"
    ]
  },
  {
    project: "Edavani : Redefining a Tribal Hamlet, Attappady, Kerala",
    awards: [
      "IIA National Awards for Excellence In Architecture 2020 - Winner - Category: Architecture Unbuilt",
      "IIA Kerala state Awards for Excellence in Architecture 2021 - Shortlisted - Category: Architecture Unbuilt"
    ]
  },
  {
    project: "Screen: the LANTERN house, Tirur, Kerala",
    awards: [
      "IIID Kerala regional chapter awards 2023 - Runner up - Category: Residential",
      "Vanitha Veedu Architectural Awards 2024 - Silver - Category: Residential",
      "IIA Kerala state Awards for Excellence in Architecture 2023 - Commendation - Category: Residential Interior"
    ]
  },
  {
    project: "HAVEN, Kannur, Kerala",
    awards: [
      "Vanitha Veedu Architectural Awards 2026 - Silver - Category: Residential Interior"
    ]
  }
];

const OTHER_RECOGNITIONS = [
  "2016: i-GEN Design Forum-2016: Listing for the most promising top 50 gen-next architects by 'Architect and Interiors India' magazine.",
  "2017: Vanitha Veedu Architecture Awards 2017: The award for the Best Young Architect",
  "2018: Selected among the '20 under 35' in the 8th edition of Design X Design Annual Exhibition 2018",
  "2018: The 'Startup of the year Award 2018' by Saint-Gobain & Economic times - Smart Green Summit",
  "2023: ID Honours Award for 2023: Category - Biophilic Design.",
  "2023: i-GEN Design Forum-2023: Listing for the most promising top 50 gen-next architects by 'Architect and Interiors India' magazine.",
  "2024: IIA National award for the best Young architect from Kerala Chapter"
];

export default function Awards() {
  const [modalOpen, setModalOpen] = useState(false);

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
          {CURATED_AWARDS.map((item) => (
            <article key={item.number} className={styles.awardItem}>
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
                {ALL_RECOGNITIONS.map((rec, idx) => (
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

              <h3 className={styles.modalSectionTitle}>Studio Honors</h3>
              <ul className={styles.modalAwardSublist} style={{ marginBottom: "32px" }}>
                {OTHER_RECOGNITIONS.map((rec, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>
                    {rec}
                  </li>
                ))}
              </ul>

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