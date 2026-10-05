import Image from "next/image";
import styles from "./Hero.module.css";

// 18 items matching the 6-column x 3-row layout
const HERO_CELLS = Array.from({ length: 18 });

// Single existing Zero Studio project image for layout & composition testing
const TEST_IMAGE = "/projects/HAVEN/1-opt.jpg";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero" aria-label="Architectural projects hero grid">
      <div className={styles.grid}>
        {HERO_CELLS.map((_, index) => (
          <div key={index} className={styles.cell}>
            <Image
              src={TEST_IMAGE}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1023px) 25vw, 16.66vw"
              priority={index < 6}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
}