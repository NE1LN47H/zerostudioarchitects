"use client";

import Link from "next/link";
import styles from "./About.module.css";
import { TeamMember } from "@/types";

interface AboutProps {
  content?: {
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
  };
  team?: TeamMember[];
}

export default function About({ content }: AboutProps) {
  const headingText = content?.heading || "The Studio";
  const p1 =
    content?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";

  return (
    <section
      className={styles.aboutSection}
      id="about"
      aria-label="Introduction"
    >
      <div className={styles.wrap}>
        <h2 id="studio-title" className={styles.heading}>
          {headingText}
        </h2>

        <div className={styles.content}>
          <p className={styles.paragraph}>{p1}</p>
        </div>

        {/* Link to Full About Page */}
        <div className={styles.readMoreRow}>
          <Link href="/about" className={styles.readMoreBtn}>
            <span>Explore Studio Story &amp; Team</span>
            <span className={styles.arrowIcon} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
