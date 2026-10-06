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

interface ProjectsProps {
  projects?: ProjectCardData[];
}

export default function Projects({ projects = [] }: ProjectsProps) {
  const featuredOnly = projects.filter((p) => p.featured);
  const displayProjects = featuredOnly.length >= 3 ? featuredOnly.slice(0, 3) : projects.slice(0, 3);

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