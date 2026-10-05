import Image from "next/image";
import styles from "./Hero.module.css";

interface HeroProjectItem {
  id: string;
  image: string;
  title: string;
  meta: string;
}

// 18 curated, diverse architectural photographs matching reference composition
const HERO_PROJECTS: HeroProjectItem[] = [
  // Row 1
  {
    id: "haven-1",
    image: "/projects/HAVEN/1-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "haven-19",
    image: "/projects/HAVEN/19-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "haven-28",
    image: "/projects/HAVEN/28-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "haven-21",
    image: "/projects/HAVEN/21-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "haven-8",
    image: "/projects/HAVEN/8-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "haven-6",
    image: "/projects/HAVEN/6-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },

  // Row 2
  {
    id: "mausam-15",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-35",
    image: "/projects/HAVEN/35-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "mausam-18",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-3",
    image: "/projects/HAVEN/3-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "mausam-11",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_11-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "mausam-41",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_41-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },

  // Row 3
  {
    id: "edavanna-14",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-2",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "mausam-1",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_1-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-12",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q12-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-17",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q17-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-16",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
];

export default function Hero({ hideBar = false }: { hideBar?: boolean }) {
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

        {/* Continuous 6x3 Architectural Photo Wall */}
        <div className={styles.grid}>
          {HERO_PROJECTS.map((project, index) => (
            <div key={project.id} className={styles.cell}>
              <Image
                src={project.image}
                alt={`${project.title} - ${project.meta}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1023px) 25vw, 16.66vw"
                priority={index < 6}
                className={styles.image}
              />
              <div className={styles.cellInfo}>
                <div className={styles.cellTitle}>{project.title}</div>
                <div className={styles.cellMeta}>{project.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}