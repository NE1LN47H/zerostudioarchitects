import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS_DATA } from "../data";
import ProjectDetailView from "../../components/ProjectDetailView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Screen: The Lantern House — Projects — Zero Studio Architectures",
  description: "A glowing perforated residential screen that harmonizes privacy and openness in Tirur, Kerala.",
};

export default function LanternHouseProjectPage() {
  const project = getProjectBySlug("SCREEN_THE_LANTERN_HOUSE");
  if (!project) notFound();

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.slug === "SCREEN_THE_LANTERN_HOUSE");
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
