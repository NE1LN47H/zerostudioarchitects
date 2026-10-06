"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSection } from "../context/SectionContext";
import styles from "./About.module.css";

const PARAGRAPH_1 =
  "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";

const PARAGRAPH_2 =
  "We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials. We love to call our practice an art studio, where the character of our designs varies vibrantly, never restricted by a single ideology, allowing architecture to remain a subtle, evolving blend of ideas.";

function RevealParagraph({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className={styles.paragraph}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordWrap}>
          <span className={styles.wordBase}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
          <span
            className={`${styles.wordFill} about-reveal-word`}
            aria-hidden="true"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </p>
  );
}

interface AboutProps {
  content?: {
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
  };
}

export default function About({ content }: AboutProps) {
  const headingText = content?.heading || "The Studio";
  const p1 = content?.paragraph1 || PARAGRAPH_1;
  const p2 = content?.paragraph2 || PARAGRAPH_2;

  const sectionRef = useRef<HTMLElement>(null);
  const headingFillRef = useRef<HTMLSpanElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  let currentIndex = 1;
  try {
    const sectionCtx = useSection();
    currentIndex = sectionCtx.currentIndex;
  } catch {
    currentIndex = 1;
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll(".about-reveal-word");
    const heading = headingFillRef.current;

    // Only run animation when Section 02 (About) is active
    if (currentIndex !== 1) {
      if (heading) gsap.set(heading, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(words, { clipPath: "inset(0 100% 0 0)" });
      return;
    }

    // Reset initial state before playing
    if (heading) gsap.set(heading, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(words, { clipPath: "inset(0 100% 0 0)" });

    const ctx = gsap.context(() => {
      // Exact sequential horizontal reveal timeline
      const tl = gsap.timeline({
        delay: 0.28,
      });

      // 1. Horizontally reveal "The Studio" heading
      if (heading) {
        tl.to(
          heading,
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            duration: 0.28,
          },
          0
        );
      }

      // 2. Horizontally reveal each word sequentially
      tl.to(
        words,
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          stagger: 0.016,
          duration: 0.08,
        },
        0.12
      );
    }, section);

    return () => ctx.revert();
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      className={styles.aboutSection}
      id="about"
      aria-label="Introduction"
    >
      <div className={styles.wrap}>
        <div style={{ marginBottom: "24px" }}>
          <h2 id="studio-title" className={styles.headingWrap}>
            <span className={styles.headingBase}>{headingText}</span>
            <span
              ref={headingFillRef}
              className={styles.headingFill}
              aria-hidden="true"
            >
              {headingText}
            </span>
          </h2>
        </div>

        <div className={styles.content}>
          <RevealParagraph text={p1} />
        </div>

        <div className={styles.readMoreRow}>
          <button
            type="button"
            className={styles.readMoreBtn}
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
          >
            <span>READ MORE</span>
            <span className={styles.arrowIcon} aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Complete Studio Philosophy Modal */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-studio-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="modal-studio-title" className={styles.modalTitle}>
                {headingText}
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setModalOpen(false)}
                aria-label="Close studio description"
              >
                CLOSE ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>{p1}</p>
              <p>{p2}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}