import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/services";
import ProjectDetailView from "@/app/components/ProjectDetailView";
import { constructMetadata } from "@/lib/seo";
import { JsonLd, getProjectJsonLd } from "@/lib/seo/structuredData";

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
    return constructMetadata({
      title: "Project Not Found",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${project.title} — Projects`,
    description: project.subtitle || project.summary,
    path: `/projects/${project.slug}`,
    image: project.heroImage,
  });
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
    allProjects.length > 1
      ? currentIndex !== -1 && currentIndex < allProjects.length - 1
        ? { slug: allProjects[currentIndex + 1].slug, title: allProjects[currentIndex + 1].title }
        : { slug: allProjects[0].slug, title: allProjects[0].title }
      : undefined;

  return (
    <>
      <JsonLd data={getProjectJsonLd(project)} />
      <ProjectDetailView
        project={project as any}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
