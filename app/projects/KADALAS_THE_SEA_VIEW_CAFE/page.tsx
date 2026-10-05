import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS_DATA } from "../data";
import ProjectDetailView from "../../components/ProjectDetailView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Kadalas - The Sea View Cafe — Projects — Zero Studio Architectures",
  description: "A beachfront hospitality space framed by panoramic sea vistas and maritime craft in South Beach, Calicut.",
};

export default function KadalasProjectPage() {
  const project = getProjectBySlug("KADALAS_THE_SEA_VIEW_CAFE");
  if (!project) notFound();

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.slug === "KADALAS_THE_SEA_VIEW_CAFE");
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
