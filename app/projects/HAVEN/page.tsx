import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS_DATA } from "../data";
import ProjectDetailView from "../../components/ProjectDetailView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "HAVEN — Projects — Zero Studio Architectures",
  description: "A quiet residential refuge in Kannur, Kerala anchored by laterite and filtered daylight.",
};

export default function HavenProjectPage() {
  const project = getProjectBySlug("HAVEN");
  if (!project) notFound();

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.slug === "HAVEN");
  const prevProject = currentIndex > 0 ? PROJECTS_DATA[currentIndex - 1] : undefined;
  const nextProject = currentIndex < PROJECTS_DATA.length - 1 ? PROJECTS_DATA[currentIndex + 1] : undefined;

  return (
    <ProjectDetailView
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
