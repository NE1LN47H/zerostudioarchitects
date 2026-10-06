import Link from "next/link";
import Image from "next/image";
import styles from "./Projects.module.css";

interface ProjectCardData {
  slug: string;
  title: string;
  category: string;
  year: string;
  heroImage: string;
  featured?: boolean;
}

const DEFAULT_PROJECTS: ProjectCardData[] = [
  {
    slug: "HAVEN",
    title: "HAVEN",
    category: "Architecture & Interiors",
    year: "2025",
    heroImage: "/projects/HAVEN/1-opt.jpg",
  },
  {
    slug: "MAUSAM_THE_HOUSE_OF_SEASONS",
    title: "Mausam - The House of Seasons",
    category: "Architecture",
    year: "2024",
    heroImage: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg",
  },
  {
    slug: "RESIDENCE_AT_EDAVANNA",
    title: "Residence at Edavanna",
    category: "Architecture",
    year: "2024",
    heroImage: "/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg",
  },
];

interface ProjectsProps {
  projects?: ProjectCardData[];
}

export default function Projects({ projects }: ProjectsProps) {
  let displayProjects = DEFAULT_PROJECTS;

  if (projects && projects.length > 0) {
    const featuredOnly = projects.filter((p) => p.featured);
    displayProjects = featuredOnly.length >= 3 ? featuredOnly.slice(0, 3) : projects.slice(0, 3);
  }

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
          {displayProjects.map((project) => (
            <article key={project.slug} className={styles.card}>
              <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardMeta}>
                  {project.category} · {project.year}
                </p>
              </Link>
            </article>
          ))}
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