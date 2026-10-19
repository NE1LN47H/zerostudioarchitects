import { getDb } from "@/lib/mongodb";
import { TeamMember } from "@/types";
import { INITIAL_TEAM } from "@/lib/data/initialTeam";

export { INITIAL_TEAM };

export async function getTeamMembers(onlyVisible = false): Promise<TeamMember[]> {
  try {
    const db = await getDb();
    const query = onlyVisible ? { visible: true } : {};
    const items = await db.collection("team").find(query).sort({ order: 1 }).toArray();

    if (!items || items.length === 0) {
      await db.collection("team").insertMany(INITIAL_TEAM);
      return onlyVisible ? INITIAL_TEAM.filter((t) => t.visible) : INITIAL_TEAM;
    }

    return items.map((doc: any) => ({
      id: doc.id || doc._id?.toString(),
      name: doc.name,
      role: doc.role,
      image: doc.image || INITIAL_TEAM.find((t) => t.name === doc.name)?.image || "/team/hamid.jpg",
      imagePublicId: doc.imagePublicId,
      bio: doc.bio,
      order: doc.order ?? 1,
      visible: doc.visible ?? true,
    }));
  } catch {
    return onlyVisible ? INITIAL_TEAM.filter((t) => t.visible) : INITIAL_TEAM;
  }
}

export async function createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember> {
  const db = await getDb();
  const newItem: TeamMember = {
    ...data,
    id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("team").insertOne(newItem);
  return newItem;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const db = await getDb();
  await db.collection("team").updateOne(
    { $or: [{ id }, { _id: id as any }] },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );

  const updated = await db.collection("team").findOne({ $or: [{ id }, { _id: id as any }] });
  if (!updated) return null;

  return {
    id: updated.id || updated._id?.toString(),
    name: updated.name,
    role: updated.role,
    image: updated.image,
    imagePublicId: updated.imagePublicId,
    bio: updated.bio,
    order: updated.order ?? 1,
    visible: updated.visible ?? true,
  };
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("team").deleteOne({ $or: [{ id }, { _id: id as any }] });
  return res.deletedCount > 0;
}

export async function reorderTeamMembers(orderedIds: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("team").initializeUnorderedBulkOp();
  orderedIds.forEach((id, index) => {
    bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
