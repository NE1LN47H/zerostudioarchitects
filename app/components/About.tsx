"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./About.module.css";
import { TeamMember } from "@/types";
import { INITIAL_TEAM } from "@/lib/data/initialTeam";

interface AboutProps {
  content?: {
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
  };
  team?: TeamMember[];
}

export default function About({ content, team = [] }: AboutProps) {
  const headingText = content?.heading || "The Studio";
  const p1 =
    content?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";

  const displayTeam = team && team.length > 0 ? team : INITIAL_TEAM;

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

        {/* Team Preview on Section 02 */}
        <div className={styles.teamPreviewWrap}>
          <span className={styles.teamPreviewLabel}>Lead Principal Architects</span>
          <div className={styles.teamGridPreview}>
            {displayTeam.map((member) => (
              <Link
                key={member.id}
                href="/about#team-heading"
                className={styles.teamCardLink}
                title={`View ${member.name} profile on dedicated About page`}
              >
                <div className={styles.teamThumb}>
                  <Image
                    src={member.image || "/team/hamid.jpg"}
                    alt={member.name}
                    fill
                    sizes="46px"
                    className={styles.teamImg}
                  />
                </div>
                <div className={styles.teamInfo}>
                  <span className={styles.teamName}>{member.name}</span>
                  <span className={styles.teamRole}>{member.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Link to Dedicated Page */}
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