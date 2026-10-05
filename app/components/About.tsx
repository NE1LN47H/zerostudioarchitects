"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingFillRef = useRef<HTMLSpanElement>(null);

  let currentIndex = 1;
  try {
    const sectionCtx = useSection();
    currentIndex = sectionCtx.currentIndex;
  } catch {
    // Outside provider
    currentIndex = 1;
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
        delay: 0.28, // smooth delay after page-turn unfolds
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

      // 2. Horizontally reveal each word sequentially across both paragraphs
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
      className="section intro"
      id="about"
      aria-label="Introduction"
    >
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: "32px" }}>
          <h2 id="studio-title" className={styles.headingWrap}>
            <span className={styles.headingBase}>The Studio</span>
            <span
              ref={headingFillRef}
              className={styles.headingFill}
              aria-hidden="true"
            >
              The Studio
            </span>
          </h2>
        </div>

        <div className={styles.content}>
          <RevealParagraph text={PARAGRAPH_1} />
          <RevealParagraph text={PARAGRAPH_2} />
        </div>
      </div>
    </section>
  );
}