import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectDetail.module.css";
import type { ProjectDetail, ProjectGalleryImage } from "../projects/data";

interface ProjectDetailViewProps {
  project: ProjectDetail;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

export default function ProjectDetailView({
  project,
  nextProject,
}: ProjectDetailViewProps) {
  const gallery = project.gallery || [];
  const hasAwards = project.awards && project.awards.length > 0;

  // Curate Gallery Layout Rhythm:
  // If gallery has at least 4 images, we match the reference photo essay rhythm:
  // - Images 0 & 1: 50% / 50% pair (Row 1)
  // - Image 2: Wide full-width (Row 2)
  // - Image 3: Split row paired with Recognitions (Row 3)
  // - Remaining middle images: Pairs or wide
  // - Final image: Closing spacious photograph
  const hasManyImages = gallery.length >= 4;
  const pair1 = gallery.slice(0, 2);
  const wideImg = gallery.length > 2 ? gallery[2] : null;
  const splitImg = gallery.length > 3 ? gallery[3] : null;
  const middleImages = gallery.length > 5 ? gallery.slice(4, gallery.length - 1) : [];
  const finalImage = gallery.length > 4 ? gallery[gallery.length - 1] : (gallery.length === 4 ? null : null);

  // Helper to parse award string into title and citation
  const parseAward = (awardStr: string) => {
    const parts = awardStr.split(/\s*[-–—]\s*/);
    return {
      title: parts[0]?.trim() || awardStr,
      citation: parts.slice(1).join(" — ").trim(),
    };
  };

  return (
    <main id="main" className={styles.pageMain}>
      <article className={styles.container}>
        {/* 01 — Top Breadcrumb Navigation */}
        <div className={styles.topNav}>
          <Link href="/projects" className={styles.backLink} aria-label="Return to projects directory">
            <span aria-hidden="true" className={styles.backArrow}>←</span>
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* 02 — Project Introduction Header */}
        <header className={styles.projectHeader}>
          <div className={styles.metaRow}>
            <span className={styles.metaText}>
              {project.category?.toUpperCase() || "ARCHITECTURE"}
              {project.year ? ` · ${project.year}` : ""}
            </span>
          </div>

          <h1 className={styles.projectTitle}>{project.title}</h1>

          <div className={styles.introRow}>
            {project.subtitle ? (
              <p className={styles.shortDescription}>{project.subtitle}</p>
            ) : project.summary ? (
              <p className={styles.shortDescription}>{project.summary}</p>
            ) : null}

            {project.editorialIntro && (
              <p className={styles.editorialIntro}>{project.editorialIntro}</p>
            )}
          </div>
        </header>

        {/* 03 — Large Hero Image */}
        {project.heroImage && (
          <section className={styles.heroSection} aria-label="Hero architectural photograph">
            <div className={styles.heroWrapper}>
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1400px"
                className={styles.heroImg}
              />
            </div>
          </section>
        )}

        {/* 04 — Project Specifications Strip */}
        <section className={styles.specsSection} aria-label="Architectural specifications">
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>LOCATION</span>
              <span className={styles.specValue}>{project.location || "Kerala, India"}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>BUILT-UP AREA</span>
              <span className={styles.specValue}>{project.area || "—"}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>PRINCIPAL ARCHITECTS</span>
              <span className={styles.specValue}>{project.leadArchitects || "Hafeez & Arjun"}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>PHOTOGRAPHY</span>
              <span className={styles.specValue}>{project.photography || "Zero Studio"}</span>
            </div>
          </div>
        </section>

        {/* 05 — Editorial Project Statement */}
        {project.summary && (
          <section className={styles.statementSection} aria-label="Philosophical core statement">
            <blockquote className={styles.statementQuote}>
              &ldquo;{project.summary}&rdquo;
            </blockquote>
          </section>
        )}

        {/* 06 — Design Narrative (The Approach) */}
        {project.narrative && project.narrative.length > 0 && (
          <section className={styles.narrativeSection} aria-label="The Approach & Design Narrative">
            <div className={styles.narrativeLayout}>
              <div className={styles.narrativeSideLabel}>
                <span className={styles.sideLabelText}>THE APPROACH</span>
              </div>

              <div className={styles.narrativeContent}>
                {project.narrative.map((item, idx) => (
                  <div key={idx} className={styles.narrativeBlock}>
                    <h2 className={styles.narrativeHeading}>{item.heading}</h2>
                    <div className={styles.narrativeBody}>
                      {item.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className={styles.narrativeParagraph}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 07 — Curated Image Gallery */}
        {gallery.length > 0 && (
          <section className={styles.gallerySection} aria-label="Curated architectural gallery">
            <div className={styles.galleryRhythm}>
              {/* Row 1: Pair of 2 side-by-side images (50% / 50%) */}
              {pair1.length > 0 && (
                <div className={pair1.length === 2 ? styles.galleryRowPair : styles.galleryRowWide}>
                  {pair1.map((img, idx) => (
                    <figure key={idx} className={styles.figure}>
                      <div className={`${styles.imageWrapper} ${pair1.length === 2 ? styles.imageWrapperHalf : styles.imageWrapperWide}`}>
                        <Image
                          src={img.src}
                          alt={img.alt || `${project.title} - Image ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={styles.photo}
                        />
                      </div>
                      {img.caption && (
                        <figcaption className={styles.caption}>
                          <span className={styles.captionNum}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.captionText}>{img.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}

              {/* Row 2: Large Wide Image (100% width) */}
              {wideImg && (
                <div className={styles.galleryRowWide}>
                  <figure className={styles.figure}>
                    <div className={`${styles.imageWrapper} ${styles.imageWrapperWide}`}>
                      <Image
                        src={wideImg.src}
                        alt={wideImg.alt || `${project.title} - Image 3`}
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className={styles.photo}
                      />
                    </div>
                    {wideImg.caption && (
                      <figcaption className={styles.caption}>
                        <span className={styles.captionNum}>03</span>
                        <span className={styles.captionText}>{wideImg.caption}</span>
                      </figcaption>
                    )}
                  </figure>
                </div>
              )}

              {/* Row 3: Split composition with Recognitions */}
              {splitImg && (
                hasAwards ? (
                  <div className={styles.galleryRowSplit}>
                    <figure className={styles.figure}>
                      <div className={`${styles.imageWrapper} ${styles.imageWrapperSplit}`}>
                        <Image
                          src={splitImg.src}
                          alt={splitImg.alt || `${project.title} - Image 4`}
                          fill
                          sizes="(max-width: 768px) 100vw, 65vw"
                          className={styles.photo}
                        />
                      </div>
                      {splitImg.caption && (
                        <figcaption className={styles.caption}>
                          <span className={styles.captionNum}>04</span>
                          <span className={styles.captionText}>{splitImg.caption}</span>
                        </figcaption>
                      )}
                    </figure>

                    {/* Architectural Recognitions & Citations Block */}
                    <div className={styles.recognitionBox}>
                      <span className={styles.recognitionLabel}>RECOGNITIONS & CITATIONS</span>
                      <ul className={styles.recognitionList}>
                        {project.awards!.map((award, aIdx) => {
                          const parsed = parseAward(award);
                          return (
                            <li key={aIdx} className={styles.recognitionItem}>
                              <h3 className={styles.awardTitle}>{parsed.title}</h3>
                              {parsed.citation && (
                                <p className={styles.awardCitation}>{parsed.citation}</p>
                              )}
                              <span className={styles.awardDash} aria-hidden="true">—</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className={styles.galleryRowWide}>
                    <figure className={styles.figure}>
                      <div className={`${styles.imageWrapper} ${styles.imageWrapperWide}`}>
                        <Image
                          src={splitImg.src}
                          alt={splitImg.alt || `${project.title} - Image 4`}
                          fill
                          sizes="(max-width: 768px) 100vw, 100vw"
                          className={styles.photo}
                        />
                      </div>
                      {splitImg.caption && (
                        <figcaption className={styles.caption}>
                          <span className={styles.captionNum}>04</span>
                          <span className={styles.captionText}>{splitImg.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  </div>
                )
              )}

              {/* Additional Middle Images (if gallery has 6+ images) */}
              {middleImages.map((img, mIdx) => {
                const globalIndex = mIdx + 5;
                const isEven = mIdx % 2 === 0;
                return (
                  <div key={mIdx} className={styles.galleryRowWide}>
                    <figure className={styles.figure}>
                      <div className={`${styles.imageWrapper} ${isEven ? styles.imageWrapperHalf : styles.imageWrapperWide}`}>
                        <Image
                          src={img.src}
                          alt={img.alt || `${project.title} - Image ${globalIndex}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 90vw"
                          className={styles.photo}
                        />
                      </div>
                      {img.caption && (
                        <figcaption className={styles.caption}>
                          <span className={styles.captionNum}>
                            {String(globalIndex).padStart(2, "0")}
                          </span>
                          <span className={styles.captionText}>{img.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  </div>
                );
              })}

              {/* Standalone recognitions if not placed in split row (fewer than 4 images) */}
              {!splitImg && hasAwards && (
                <div className={`${styles.recognitionBox} ${styles.recognitionStandalone}`}>
                  <span className={styles.recognitionLabel}>RECOGNITIONS & CITATIONS</span>
                  <ul className={styles.recognitionList}>
                    {project.awards!.map((award, aIdx) => {
                      const parsed = parseAward(award);
                      return (
                        <li key={aIdx} className={styles.recognitionItem}>
                          <h3 className={styles.awardTitle}>{parsed.title}</h3>
                          {parsed.citation && (
                            <p className={styles.awardCitation}>{parsed.citation}</p>
                          )}
                          <span className={styles.awardDash} aria-hidden="true">—</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 08 — Final Closing Photograph */}
        {finalImage && (
          <section className={styles.finalImageSection} aria-label="Closing architectural perspective">
            <figure className={styles.figure}>
              <div className={`${styles.imageWrapper} ${styles.imageWrapperFull}`}>
                <Image
                  src={finalImage.src}
                  alt={finalImage.alt || `${project.title} - Closing perspective`}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className={styles.photo}
                />
              </div>
              {finalImage.caption && (
                <figcaption className={styles.caption}>
                  <span className={styles.captionNum}>
                    {String(gallery.length).padStart(2, "0")}
                  </span>
                  <span className={styles.captionText}>{finalImage.caption}</span>
                </figcaption>
              )}
            </figure>
          </section>
        )}

        {/* 09 — Bottom Project Navigation */}
        <nav className={styles.projectNav} aria-label="Project pagination">
          <Link href="/projects" className={styles.allProjectsBtn}>
            ALL PROJECTS
          </Link>

          {nextProject && (
            <Link href={`/projects/${nextProject.slug}`} className={styles.nextProjectLink}>
              <span>NEXT: {nextProject.title.toUpperCase()}</span>
              <span aria-hidden="true" className={styles.nextArrow}>→</span>
            </Link>
          )}

          <div className={styles.mobileDash} aria-hidden="true">—</div>
        </nav>
      </article>
    </main>
  );
}
