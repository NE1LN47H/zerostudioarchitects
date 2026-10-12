import { getDb } from "@/lib/mongodb";
import { HeroItem } from "@/types";

export async function getHeroItems(onlyVisible = false): Promise<HeroItem[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("hero").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    id: doc.id || doc._id?.toString(),
    image: doc.image,
    imagePublicId: doc.imagePublicId,
    title: doc.title,
    category: doc.category,
    year: doc.year,
    meta: doc.meta || `${doc.category} · ${doc.year}`,
    projectSlug: doc.projectSlug,
    order: doc.order ?? 1,
    visible: doc.visible ?? true,
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
