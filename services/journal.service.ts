import { getDb } from "@/lib/mongodb";
import { JournalArticle } from "@/types";

export async function getJournalArticles(onlyVisible = false): Promise<JournalArticle[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("journal").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    date: doc.date,
    excerpt: doc.excerpt,
    image: doc.image,
    imagePublicId: doc.imagePublicId,
    author: doc.author,
    content: doc.content || { intro: "", paragraphs: [] },
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  }));
}

export async function getArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const db = await getDb();
  const doc = await db.collection("journal").findOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });

  if (!doc) return null;

  return {
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    date: doc.date,
    excerpt: doc.excerpt,
    image: doc.image,
    imagePublicId: doc.imagePublicId,
    author: doc.author,
    content: doc.content || { intro: "", paragraphs: [] },
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  };
}

export async function createJournalArticle(data: JournalArticle): Promise<JournalArticle> {
  const db = await getDb();
  const now = new Date().toISOString();
  const newArticle: JournalArticle = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("journal").insertOne(newArticle);
  return newArticle;
}

export async function updateJournalArticle(
  slug: string,
  updates: Partial<JournalArticle>
): Promise<JournalArticle | null> {
  const db = await getDb();
  await db.collection("journal").updateOne(
    { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );

  return await getArticleBySlug(updates.slug || slug);
}

export async function deleteJournalArticle(slug: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("journal").deleteOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });
  return res.deletedCount > 0;
}

export async function reorderJournalArticles(orderedSlugs: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("journal").initializeUnorderedBulkOp();
  orderedSlugs.forEach((slug, index) => {
    bulk.find({ slug }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}
