import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS_DATA } from "./data";
import ProjectCard from "../components/ProjectCard";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — Zero Studio Architectures",
  description: "Selected architectural, residential, commercial and cultural projects by Zero Studio Architectures.",
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.description}>
            Homes, cultural spaces, landscapes and hospitality projects designed with context, climate and honest materials.
          </p>
        </header>

        <div className={styles.separator} aria-hidden="true" />

        <div className={styles.grid}>
          {PROJECTS_DATA.map((project, idx) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={idx < 3}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
