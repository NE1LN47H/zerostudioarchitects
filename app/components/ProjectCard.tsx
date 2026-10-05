import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";
import type { ProjectDetail } from "../projects/data";

interface ProjectCardProps {
  project: ProjectDetail;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article style={{ height: "100%" }}>
      <Link href={`/projects/${project.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
            priority={priority}
            className={styles.image}
          />
        </div>
        <div className={styles.category}>{project.category}</div>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.excerpt}>{project.subtitle || project.summary}</p>
        <div className={styles.meta}>
          {project.year} · {project.location} · {project.area}
        </div>
      </Link>
    </article>
  );
}
