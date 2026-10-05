import Link from 'next/link';
import Image from 'next/image';
import styles from './Journal.module.css';

export default function Journal() {
  return (
    <section id="journal" aria-labelledby="journal-title" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 id="journal-title" className={styles.title}>
              Journal
            </h2>
            <p className={styles.subtitle}>
              Notes on process, materials and places we&apos;ve worked.
            </p>
          </div>

          <Link href="/journal" className={styles.headerLink}>
            <span>View all</span>
            <span className={styles.linkArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <Link
              href="/journal/the-architecture-of-quiet-spaces"
              className={styles.cardLink}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="The Architecture of Quiet Spaces"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>
                The Architecture of Quiet Spaces
              </h3>
              <p className={styles.cardMeta}>
                Architecture & Context · 05 Oct 2026
              </p>
            </Link>
          </article>

          <article className={styles.card}>
            <Link
              href="/journal/tactility-of-laterite-and-exposed-concrete"
              className={styles.cardLink}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg"
                  alt="Tactility of Laterite and Exposed Concrete"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>
                Tactility of Laterite & Concrete
              </h3>
              <p className={styles.cardMeta}>
                Material & Craft · 18 Sep 2026
              </p>
            </Link>
          </article>

          <article className={styles.card}>
            <Link
              href="/journal/breathing-walls-and-tropical-microclimates"
              className={styles.cardLink}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg"
                  alt="Breathing Walls and Tropical Microclimates"
                  fill
                  sizes="(max-width: 860px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>
                Breathing Walls in the Tropics
              </h3>
              <p className={styles.cardMeta}>
                Climate Responsive · 28 Aug 2026
              </p>
            </Link>
          </article>
        </div>

        <div className={styles.footRow}>
          <Link href="/journal" className={styles.viewAllBtn}>
            <span>View all journal</span>
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}