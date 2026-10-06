import Image from "next/image";
import styles from "./Hero.module.css";
import type { HeroItem } from "@/lib/types";

interface HeroProps {
  hideBar?: boolean;
  items?: HeroItem[];
}

export default function Hero({ hideBar = false, items = [] }: HeroProps) {
  return (
    <section className={styles.hero} id="hero" aria-label="Zero Studio architectural projects">
      <div className={styles.container}>
        {!hideBar && (
          <div className={styles.studioBar}>
            <div className={styles.labelGroup}>
              <span className={styles.studioLabel}>THE STUDIO</span>
              <span className={styles.studioLine} aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Continuous 6x3 Architectural Photo Wall from MongoDB */}
        <div className={styles.grid}>
          {items.map((project, index) => {
            const metaString = project.meta || `${project.category || "RESIDENTIAL"} · ${project.year || "2025"}`;
            return (
              <div key={project.id} className={styles.cell}>
                <Image
                  src={project.image}
                  alt={`${project.title} - ${metaString}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1023px) 25vw, 16.66vw"
                  priority={index < 6}
                  className={styles.image}
                />
                <div className={styles.cellInfo}>
                  <div className={styles.cellTitle}>{project.title}</div>
                  <div className={styles.cellMeta}>{metaString}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}