import { getDb } from "@/lib/mongodb";
import { MediaPublication } from "@/types";

import { INITIAL_PUBLICATIONS } from "@/lib/data/initialPublications";
export { INITIAL_PUBLICATIONS };


export async function getPublications(onlyVisible = false): Promise<MediaPublication[]> {
  try {
    const db = await getDb();
    const query = onlyVisible ? { visible: true } : {};
    const items = await db.collection("publications").find(query).sort({ order: 1 }).toArray();

    if (!items || items.length === 0) {
      // Seed if empty
      await db.collection("publications").insertMany(INITIAL_PUBLICATIONS);
      return onlyVisible ? INITIAL_PUBLICATIONS.filter((p) => p.visible) : INITIAL_PUBLICATIONS;
    }

    return items.map((doc: any) => ({
      id: doc.id || doc._id?.toString(),
      title: doc.title,
      platform: doc.platform,
      project: doc.project,
      url: doc.url,
      year: doc.year,
      format: doc.format,
      description: doc.description,
      image: doc.image,
      imagePublicId: doc.imagePublicId,
      order: doc.order ?? 1,
      curated: doc.curated ?? false,
      visible: doc.visible ?? true,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  } catch {
    return onlyVisible ? INITIAL_PUBLICATIONS.filter((p) => p.visible) : INITIAL_PUBLICATIONS;
  }
}

export async function createPublication(data: Omit<MediaPublication, "id">): Promise<MediaPublication> {
  const db = await getDb();
  const newItem: MediaPublication = {
    ...data,
    id: `pub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection("publications").insertOne(newItem);
  return newItem;
}

export async function updatePublication(
  id: string,
  updates: Partial<MediaPublication>
): Promise<MediaPublication | null> {
  const db = await getDb();
  await db.collection("publications").updateOne(
    { $or: [{ id }, { _id: id as any }] },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );

  const updated = await db.collection("publications").findOne({ $or: [{ id }, { _id: id as any }] });
  if (!updated) return null;

  return {
    id: updated.id || updated._id?.toString(),
    title: updated.title,
    platform: updated.platform,
    project: updated.project,
    url: updated.url,
    year: updated.year,
    format: updated.format,
    description: updated.description,
    image: updated.image,
    imagePublicId: updated.imagePublicId,
    order: updated.order ?? 1,
    curated: updated.curated ?? false,
    visible: updated.visible ?? true,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deletePublication(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("publications").deleteOne({ $or: [{ id }, { _id: id as any }] });
  return res.deletedCount > 0;
}

export async function reorderPublications(orderedIds: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("publications").initializeUnorderedBulkOp();
  orderedIds.forEach((id, index) => {
    bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
