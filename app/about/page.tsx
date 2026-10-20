import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutContent } from "@/services";
import styles from "./about.module.css";
import { constructMetadata } from "@/lib/seo";
import { INITIAL_TEAM } from "@/lib/data/initialTeam";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "About Studio & Team",
  description:
    "Zero Studio is a creative architectural design studio founded in 2013, based in Calicut, Kerala. Discover our philosophy, narrative and lead principal architects.",
  path: "/about",
});

export default async function DedicatedAboutPage() {
  const [about] = await Promise.all([
    getAboutContent(),
  ]);

  // Static ordered team
  const team = INITIAL_TEAM;

  const headingText = about?.heading || "The Studio";
  const p1 =
    about?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";
  const p2 =
    about?.paragraph2 ||
    "We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials. We love to call our practice an art studio, where the character of our designs varies vibrantly, never restricted by a single ideology, allowing architecture to remain a subtle, evolving blend of ideas.";

  return (
    <main id="main">
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Studio Philosophy & Narrative */}
        <header className={styles.studioHeader}>
          <span className={styles.studioBadge}>ZERO STUDIO (ESTD 2013)</span>
          <h1 className={styles.heading}>{headingText}</h1>

          <div className={styles.narrativeWrap}>
            <p>{p1}</p>
            {p2 && <p>{p2}</p>}
          </div>
        </header>

        {/* Stats Strip */}
        {about?.stats && about.stats.length > 0 && (
          <div className={styles.statsRow}>
            {about.stats.map((stat, idx) => (
              <div key={idx} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Team Section with Portrait Images */}
        <section className={styles.teamSection} aria-labelledby="team-heading">
          <div className={styles.sectionHeader}>
            <h2 id="team-heading" className={styles.sectionTitle}>
              Team
            </h2>
            <p className={styles.sectionSubtitle}>
              The team guiding design discourse, vernacular exploration, and tactile craft at Zero Studio.
            </p>
          </div>

          <div className={styles.teamList}>
            {team.map((member, idx) => {
              const isLandscape = (member.width || 0) > (member.height || 0);
              return (
                <article key={member.id} className={styles.teamCard}>
                  <div
                    className={`${styles.imageWrap} ${
                      isLandscape ? styles.landscapeWrap : styles.portraitWrap
                    }`}
                  >
                    <Image
                      src={member.image || "/team/01-founders.jpg"}
                      alt={member.name}
                      width={member.width || 3072}
                      height={member.height || 4608}
                      sizes="(max-width: 600px) 100vw, 480px"
                      className={styles.teamImage}
                      priority={idx === 0}
                    />
                  </div>

                  <div className={styles.cardInfo}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    {member.bio && <span className={styles.memberYears}>{member.bio}</span>}
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
