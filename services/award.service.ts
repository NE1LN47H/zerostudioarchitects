import { getDb } from "@/lib/mongodb";
import { AwardItem } from "@/types";

export async function getAwards(onlyVisible = false): Promise<AwardItem[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("awards").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    id: doc.id || doc._id?.toString(),
    number: doc.number,
    award: doc.award,
    project: doc.project,
    organization: doc.organization,
    category: doc.category,
    year: doc.year,
    description: doc.description,
    image: doc.image,
    imagePublicId: doc.imagePublicId,
    order: doc.order ?? 1,
    curated: doc.curated ?? false,
    visible: doc.visible ?? true,
    type: doc.type ?? "project",
  }));
}

export async function createAward(data: Omit<AwardItem, "id">): Promise<AwardItem> {
  const db = await getDb();
  const newItem: AwardItem = {
    ...data,
    id: `award-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("awards").insertOne(newItem);
  return newItem;
}

export async function updateAward(id: string, updates: Partial<AwardItem>): Promise<AwardItem | null> {
  const db = await getDb();
  await db.collection("awards").updateOne(
    { $or: [{ id }, { _id: id as any }] },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );

  const updated = await db.collection("awards").findOne({ $or: [{ id }, { _id: id as any }] });
  if (!updated) return null;

  return {
    id: updated.id || updated._id?.toString(),
    number: updated.number,
    award: updated.award,
    project: updated.project,
    organization: updated.organization,
    category: updated.category,
    year: updated.year,
    description: updated.description,
    image: updated.image,
    imagePublicId: updated.imagePublicId,
    order: updated.order ?? 1,
    curated: updated.curated ?? false,
    visible: updated.visible ?? true,
    type: updated.type ?? "project",
  };
}

export async function deleteAward(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("awards").deleteOne({ $or: [{ id }, { _id: id as any }] });
  return res.deletedCount > 0;
}

export async function reorderAwards(orderedIds: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("awards").initializeUnorderedBulkOp();
  orderedIds.forEach((id, index) => {
    bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
