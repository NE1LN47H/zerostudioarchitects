import { getDb } from "@/lib/mongodb";
import { AdminUser } from "@/types";

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const db = await getDb();
  const doc = await db.collection("admin_users").findOne({
    email: email.toLowerCase().trim(),
  });

  if (!doc) return null;

  return {
    id: doc.id || doc._id?.toString(),
    email: doc.email,
    name: doc.name,
    passwordHash: doc.passwordHash,
    role: doc.role,
    createdAt: doc.createdAt,
  };
}

export async function createAdminUser(data: Omit<AdminUser, "id">): Promise<AdminUser> {
  const db = await getDb();
  const newUser: AdminUser = {
    ...data,
    id: `admin-${Date.now()}`,
    email: data.email.toLowerCase().trim(),
  };

  await db.collection("admin_users").insertOne(newUser);
  return newUser;
}
