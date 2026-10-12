import { getDb } from "@/lib/mongodb";
import { Project } from "@/types";

export async function getProjects(onlyVisible = false): Promise<Project[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("projects").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || "",
    editorialIntro: doc.editorialIntro,
    category: doc.category,
    year: doc.year,
    location: doc.location,
    area: doc.area,
    client: doc.client,
    leadArchitects: doc.leadArchitects,
    photography: doc.photography,
    awards: doc.awards || [],
    heroImage: doc.heroImage,
    heroImagePublicId: doc.heroImagePublicId,
    summary: doc.summary,
    narrative: doc.narrative || [],
    gallery: doc.gallery || [],
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  const doc = await db.collection("projects").findOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });

  if (!doc) return null;

  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || "",
    editorialIntro: doc.editorialIntro,
    category: doc.category,
    year: doc.year,
    location: doc.location,
    area: doc.area,
    client: doc.client,
    leadArchitects: doc.leadArchitects,
    photography: doc.photography,
    awards: doc.awards || [],
    heroImage: doc.heroImage,
    heroImagePublicId: doc.heroImagePublicId,
    summary: doc.summary,
    narrative: doc.narrative || [],
    gallery: doc.gallery || [],
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  };
}

export async function createProject(data: Project): Promise<Project> {
  const db = await getDb();
  const now = new Date().toISOString();
  const newProject: Project = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("projects").insertOne(newProject);
  return newProject;
}

export async function updateProject(slug: string, updates: Partial<Project>): Promise<Project | null> {
  const db = await getDb();
  await db.collection("projects").updateOne(
    { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );

  return await getProjectBySlug(updates.slug || slug);
}

export async function deleteProject(slug: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("projects").deleteOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });
  return res.deletedCount > 0;
}

export async function reorderProjects(orderedSlugs: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("projects").initializeUnorderedBulkOp();
  orderedSlugs.forEach((slug, index) => {
    bulk.find({ slug }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
