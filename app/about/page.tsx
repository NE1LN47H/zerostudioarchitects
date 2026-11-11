import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutContent, getTeamMembers } from "@/services";
import styles from "./about.module.css";
import { constructMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbsJsonLd } from "@/lib/seo/structuredData";
import { INITIAL_TEAM } from "@/lib/data/initialTeam";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "About Studio & Principals",
  description:
    "Zero Studio is an award-winning architectural practice founded in 2013, based in Kozhikode (Calicut), Kerala. Led by Principal Architects Shabna & Nidhinraj KJ, pioneering vernacular craft, tropical sustainability, and contextual design.",
  path: "/about",
});

export default async function AboutPage() {
  const [about, teamData] = await Promise.all([
    getAboutContent(),
    getTeamMembers(true),
  ]);

  const team = teamData && teamData.length > 0 ? teamData : INITIAL_TEAM;
  const founders = team.find((m) => m.id === "team-1") || team[0];
  const principals = team.find((m) => m.id === "team-2") || team[1];
  const linearTeam = team.filter((m) => m.id !== "team-1" && m.id !== "team-2");

  const headingText = about?.heading || "The Studio";
  const p1 =
    about?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";
  const p2 =
    about?.paragraph2 ||
    "We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials. We love to call our practice an art studio, where the character of our designs varies vibrantly, never restricted by a single ideology, allowing architecture to remain a subtle, evolving blend of ideas.";

  return (
    <main id="main">
      <JsonLd
        data={getBreadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Studio Philosophy & Narrative */}
        <header className={styles.studioHeader}>
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

        {/* Team Section with 3 Linear Tiers */}
        <section className={styles.teamSection} aria-labelledby="team-heading">
          <div className={styles.sectionHeader}>
            <h2 id="team-heading" className={styles.sectionTitle}>
              Team
            </h2>
            <p className={styles.sectionSubtitle}>
              The team guiding design discourse, vernacular exploration, and tactile craft at Zero Studio.
            </p>
          </div>

          <div className={styles.teamStructure}>
            {/* Line 1: Founding Partners */}
            {founders && (
              <div className={styles.teamTier}>
                {/* <span className={styles.tierLabel}>Line 1 — Founding Partners</span> */}
                <article className={styles.founderCard}>
                  <div className={`${styles.imageWrap} ${styles.landscapeWrap}`}>
                    <Image
                      src={founders.image || "/team/01-founders.jpg"}
                      alt={founders.name}
                      width={founders.width || 8192}
                      height={founders.height || 5301}
                      sizes="(max-width: 768px) 100vw, 560px"
                      className={styles.teamImage}
                      priority
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.memberName}>{founders.name}</h3>
                    {founders.bio && <span className={styles.memberYears}>{founders.bio}</span>}
                    <p className={styles.memberRole}>{founders.role}</p>
                  </div>
                </article>
              </div>
            )}

            {/* Line 2: Principal Architects */}
            {principals && (
              <div className={styles.teamTier}>
                {/* <span className={styles.tierLabel}>Line 2 — Principal Architects</span> */}
                <article className={styles.principalCard}>
                  <div className={`${styles.imageWrap} ${styles.portraitWrap}`}>
                    <Image
                      src={principals.image || "/team/02-principals.jpg"}
                      alt={principals.name}
                      width={principals.width || 3072}
                      height={principals.height || 4608}
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={styles.teamImage}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.memberName}>{principals.name}</h3>
                    <p className={styles.memberRole}>{principals.role}</p>
                  </div>
                </article>
              </div>
            )}

            {/* Line 3: Project Architects, Studio Coordinator, Site Supervisor, Senior Draftsperson (linearly) */}
            {linearTeam.length > 0 && (
              <div className={styles.teamTier}>
                {/* <span className={styles.tierLabel}>
                  Line 3 — Project Architects, Studio Coordinator, Site Supervisor, Senior Draftsperson
                </span> */}
                <div className={styles.linearGrid}>
                  {linearTeam.map((member) => (
                    <article key={member.id} className={styles.linearMemberCard}>
                      <div className={styles.linearImageWrap}>
                        <Image
                          src={member.image || "/team/01-founders.jpg"}
                          alt={member.name}
                          width={member.width || 3072}
                          height={member.height || 4608}
                          sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 180px"
                          className={styles.linearTeamImage}
                        />
                      </div>
                      <div className={styles.linearCardInfo}>
                        <h4 className={styles.linearMemberName}>{member.name}</h4>
                        <p className={styles.linearMemberRole}>{member.role}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
