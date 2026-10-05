import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectDetail.module.css";
import type { ProjectDetail } from "../projects/data";

interface ProjectDetailViewProps {
  project: ProjectDetail;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

export default function ProjectDetailView({
  project,
  prevProject,
  nextProject,
}: ProjectDetailViewProps) {
  return (
    <main id="main" style={{ paddingTop: "80px", minHeight: "100vh", backgroundColor: "var(--bg, #ffffff)" }}>
      <article className={styles.container}>
        {/* Breadcrumb Back Link */}
        <Link href="/projects" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Back to All Projects</span>
        </Link>

        {/* Editorial Header */}
        <header className={styles.header}>
          <div className={styles.categoryRow}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.dividerDot} aria-hidden="true" />
            <span className={styles.year}>{project.year}</span>
          </div>

          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.subtitle}>{project.subtitle}</p>
        </header>

        {/* Key Architectural Specifications */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Location</span>
            <span className={styles.specValue}>{project.location}</span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>Built-Up Area</span>
            <span className={styles.specValue}>{project.area}</span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>Principal Architects</span>
            <span className={styles.specValue}>{project.leadArchitects || "Hafeez & Arjun"}</span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>Photography</span>
            <span className={styles.specValue}>{project.photography}</span>
          </div>
        </div>

        {/* Full-Width Hero Architectural Photography */}
        <div className={styles.heroImageWrapper}>
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className={styles.heroImage}
          />
        </div>

        {/* Editorial Narrative & Philosophical Core */}
        <section className={styles.narrativeSection}>
          <div className={styles.lead}>&ldquo;{project.summary}&rdquo;</div>

          {project.narrative.map((section, idx) => (
            <div key={idx} className={styles.storyBlock}>
              <h2 className={styles.storyHeading}>{section.heading}</h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={styles.paragraph}>
                  {p}
                </p>
              ))}
            </div>
          ))}
        </section>

        {/* Project Honors / Awards If Present */}
        {project.awards && project.awards.length > 0 && (
          <div className={styles.awardsBox}>
            <h3 className={styles.awardTitle}>Recognitions & Citations</h3>
            <ul className={styles.awardList}>
              {project.awards.map((award, aIdx) => (
                <li key={aIdx} className={styles.awardItem}>
                  {award}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Curated Architectural Photography Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.galleryHeader}>
              <h2 className={styles.galleryTitle}>Project Gallery & Details</h2>
              <span className={styles.galleryCount}>
                {project.gallery.length + 1} Photographs
              </span>
            </div>

            <div className={styles.galleryGrid}>
              {project.gallery.map((img, idx) => {
                const isWide = img.aspectRatio === "wide";
                const isPortrait = img.aspectRatio === "portrait";

                let wrapperClass = styles.galleryImageWrapper;
                if (isWide) wrapperClass += ` ${styles.galleryImageWrapperWide}`;
                else if (isPortrait) wrapperClass += ` ${styles.galleryImageWrapperPortrait}`;

                return (
                  <figure
                    key={idx}
                    className={`${styles.galleryCard} ${isWide ? styles.galleryCardWide : ""}`}
                  >
                    <div className={wrapperClass}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes={
                          isWide
                            ? "(max-width: 860px) 100vw, 1400px"
                            : "(max-width: 860px) 100vw, 50vw"
                        }
                        className={styles.galleryImage}
                      />
                    </div>
                    {img.caption && (
                      <figcaption className={styles.galleryCaption}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Project Navigation */}
        <nav className={styles.footerNav} aria-label="Project pagination">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className={`${styles.footerBtn} ${styles.footerBtnPrev}`}
            >
              <span aria-hidden="true">←</span>
              <span>Prev: {prevProject.title}</span>
            </Link>
          ) : (
            <span />
          )}

          <Link href="/projects" className={styles.centerAllBtn}>
            All Projects
          </Link>

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className={`${styles.footerBtn} ${styles.footerBtnNext}`}
            >
              <span>Next: {nextProject.title}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </main>
  );
}
