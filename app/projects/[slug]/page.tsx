import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/db/service";
import ProjectDetailView from "@/app/components/ProjectDetailView";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — Zero Studio Architectures",
    };
  }

  return {
    title: `${project.title} — Projects — Zero Studio Architectures`,
    description: project.subtitle || project.summary,
  };
}

export default async function DynamicProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects(true);
  const currentIndex = allProjects.findIndex(
    (p) => p.slug.toLowerCase() === project.slug.toLowerCase()
  );

  const prevProject =
    currentIndex > 0
      ? { slug: allProjects[currentIndex - 1].slug, title: allProjects[currentIndex - 1].title }
      : undefined;

  const nextProject =
    currentIndex !== -1 && currentIndex < allProjects.length - 1
      ? { slug: allProjects[currentIndex + 1].slug, title: allProjects[currentIndex + 1].title }
      : undefined;

  return (
    <ProjectDetailView
      project={project as any}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
