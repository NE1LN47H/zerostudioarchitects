import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS_DATA } from "../data";
import ProjectDetailView from "../../components/ProjectDetailView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Residence at Edavanna — Projects — Zero Studio Architectures",
  description: "A humble family home designed for meaningful ecological life and community roots in Edavanna, Kerala.",
};

export default function ResidenceAtEdavannaProjectPage() {
  const project = getProjectBySlug("RESIDENCE_AT_EDAVANNA");
  if (!project) notFound();

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.slug === "RESIDENCE_AT_EDAVANNA");
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
