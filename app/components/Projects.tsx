import Link from 'next/link';
import Image from 'next/image';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="projects-title" className={styles.title}>
              Selected Projects
            </h2>
            <p className={styles.subtitle}>
              Homes, workplaces and public buildings.
            </p>
          </div>

          <Link href="/projects" className={styles.headerLink}>
            <span>View all</span>
            <span className={styles.linkArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <Link href="/projects/HAVEN" className={styles.cardLink}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="HAVEN"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>HAVEN</h3>
              <p className={styles.cardMeta}>Architecture & Interiors · 2025</p>
            </Link>
          </article>

          <article className={styles.card}>
            <Link href="/projects/MAUSAM_THE_HOUSE_OF_SEASONS" className={styles.cardLink}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg"
                  alt="Mausam - The House of Seasons"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>Mausam - The House of Seasons</h3>
              <p className={styles.cardMeta}>Architecture · 2024</p>
            </Link>
          </article>

          <article className={styles.card}>
            <Link href="/projects/RESIDENCE_AT_EDAVANNA" className={styles.cardLink}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg"
                  alt="Residence at Edavanna"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>Residence at Edavanna</h3>
              <p className={styles.cardMeta}>Architecture · 2024</p>
            </Link>
          </article>
        </div>

        <div className={styles.footRow}>
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>View all projects</span>
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}