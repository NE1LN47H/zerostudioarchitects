import Image from "next/image";
import styles from "./Hero.module.css";

interface HeroProjectItem {
  id: string;
  image: string;
  title: string;
  meta: string;
}

// 18 curated, diverse architectural photographs from Zero Studio projects
const HERO_PROJECTS: HeroProjectItem[] = [
  {
    id: "haven-1",
    image: "/projects/HAVEN/1-opt.jpg",
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
    id: "edavanna-12",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q12-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-28",
    image: "/projects/HAVEN/28-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "mausam-1",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_1-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-2",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-19",
    image: "/projects/HAVEN/19-opt.jpg",
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
    id: "edavanna-14",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-3",
    image: "/projects/HAVEN/3-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "mausam-21",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_21-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-8",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q8-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "mausam-15",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-6",
    image: "/projects/HAVEN/6-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "edavanna-17",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q17-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "haven-27",
    image: "/projects/HAVEN/27-opt.jpg",
    title: "HAVEN",
    meta: "RESIDENTIAL · 2025",
  },
  {
    id: "mausam-26",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_26-opt.jpg",
    title: "MAUSAM",
    meta: "RESIDENTIAL · 2024",
  },
  {
    id: "edavanna-16",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
    title: "RESIDENCE AT EDAVANNA",
    meta: "RESIDENTIAL · 2024",
  },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="hero" aria-label="Zero Studio Architecture introduction and projects">
      <div className={styles.container}>
        {/* Editorial Introduction Header */}
        <div className={styles.introRow}>
          <div className={styles.introLeft}>
            <span className={styles.brandLabel}>Zero Studio</span>
            <h1 className={styles.mainHeading}>
              Architecture shaped<br />
              by context, people and place.
            </h1>
          </div>

          <div className={styles.introRight}>
            <p className={styles.supportingText}>
              A design studio exploring the intersection of architecture, interiors, climate and material through a contemporary lens.
            </p>
            <div className={styles.counter} aria-label="Featured projects counter">
              01 — 18
            </div>
          </div>
        </div>

        {/* Uniform Architectural Image Grid */}
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