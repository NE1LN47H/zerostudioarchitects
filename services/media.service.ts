import { getDb } from "@/lib/mongodb";
import { MediaItem } from "@/types";

export async function getMediaItems(): Promise<MediaItem[]> {
  const db = await getDb();
  const items = await db.collection("media").find({}).sort({ createdAt: -1 }).toArray();

  return items.map((doc: any) => ({
    id: doc.id || doc._id?.toString(),
    url: doc.url,
    publicId: doc.publicId,
    width: doc.width,
    height: doc.height,
    format: doc.format,
    originalFilename: doc.originalFilename,
    sizeBytes: doc.sizeBytes,
    createdAt: doc.createdAt,
  }));
}

export async function saveMediaItem(data: Omit<MediaItem, "id">): Promise<MediaItem> {
  const db = await getDb();
  const newItem: MediaItem = {
    ...data,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  await db.collection("media").insertOne(newItem);
  return newItem;
}

export const createMediaItem = saveMediaItem;

export async function deleteMediaRecord(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("media").deleteOne({ $or: [{ id }, { _id: id as any }] });
  return res.deletedCount > 0;
}

export const deleteMediaItem = deleteMediaRecord;

