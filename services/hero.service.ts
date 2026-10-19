import { getDb } from "@/lib/mongodb";
import { HeroItem } from "@/types";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function getHeroItems(onlyVisible = false): Promise<HeroItem[]> {
  const db = await getDb();
  // Fetch published projects dynamically from MongoDB
  const query = onlyVisible ? { visible: { $ne: false } } : { visible: { $ne: false } };
  const projects = await db.collection("projects").find(query).toArray();

  if (!projects || projects.length === 0) {
    return [];
  }

  // Filter projects with valid cover heroImage
  const validProjects = projects.filter((p: any) => Boolean(p.heroImage));
  if (validProjects.length === 0) {
    return [];
  }

  const targetCount = 18;
  let selected: any[] = [];

  if (validProjects.length >= targetCount) {
    // If more than (or equal to) 18 published projects, randomly select 18 unique projects with NO duplicates
    selected = shuffle(validProjects).slice(0, targetCount);
  } else {
    // If fewer than 18 published projects, use ALL available projects, shuffle them randomly,
    // and allow duplicates to fill the remaining grid slots until there are 18 images
    selected = shuffle(validProjects);
    while (selected.length < targetCount) {
      const remainingNeeded = targetCount - selected.length;
      const additionalBatch = shuffle(validProjects);
      selected.push(...additionalBatch.slice(0, remainingNeeded));
    }
  }

  return selected.map((doc: any, index: number) => ({
    id: `hero-${doc.slug}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    image: doc.heroImage,
    imagePublicId: doc.heroImagePublicId,
    title: doc.title,
    category: doc.category || "Architecture",
    year: doc.year ? String(doc.year) : "",
    meta: `${doc.category || "RESIDENTIAL"} · ${doc.year || "2025"}`,
    projectSlug: doc.slug,
    order: index + 1,
    visible: true,
  }));
}

export async function createHeroItem(data: Omit<HeroItem, "id">): Promise<HeroItem> {
  const db = await getDb();
  const newItem: HeroItem = {
    ...data,
    id: `hero-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    meta: data.meta || `${data.category} · ${data.year}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection("hero").insertOne(newItem);
  return newItem;
}

export async function updateHeroItem(id: string, updates: Partial<HeroItem>): Promise<HeroItem | null> {
  const db = await getDb();
  await db.collection("hero").updateOne(
    { $or: [{ id }, { _id: id as any }] },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );
  const updated = await db.collection("hero").findOne({ $or: [{ id }, { _id: id as any }] });
  if (!updated) return null;

  return {
    id: updated.id || updated._id?.toString(),
    image: updated.image,
    imagePublicId: updated.imagePublicId,
    title: updated.title,
    category: updated.category,
    year: updated.year,
    meta: updated.meta || `${updated.category} · ${updated.year}`,
    projectSlug: updated.projectSlug,
    order: updated.order ?? 1,
    visible: updated.visible ?? true,
  };
}

export async function deleteHeroItem(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("hero").deleteOne({ $or: [{ id }, { _id: id as any }] });
  return res.deletedCount > 0;
}

export async function reorderHeroItems(orderedIds: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("hero").initializeUnorderedBulkOp();
  orderedIds.forEach((id, index) => {
    bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
