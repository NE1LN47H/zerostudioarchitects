import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS_DATA } from "../data";
import ProjectDetailView from "../../components/ProjectDetailView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reviving The Spirit of A Place — Projects — Zero Studio Architectures",
  description: "Story of an Abandoned Laterite Quarry restored into a thriving ecological sanctuary in Malappuram, Kerala.",
};

export default function RevivingProjectPage() {
  const project = getProjectBySlug("REVIVING_THE_SPIRIT_OF_A_PLACE");
  if (!project) notFound();

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.slug === "REVIVING_THE_SPIRIT_OF_A_PLACE");
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
