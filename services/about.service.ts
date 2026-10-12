import { getDb } from "@/lib/mongodb";
import { AboutContent } from "@/types";

export async function getAboutContent(): Promise<AboutContent> {
  const db = await getDb();
  const doc = await db.collection("about").findOne({});
  if (doc) {
    return {
      heading: doc.heading,
      paragraph1: doc.paragraph1,
      paragraph2: doc.paragraph2,
      leadArchitects: doc.leadArchitects,
      stats: doc.stats,
    };
  }

  return {
    heading: "We design spaces rooted in their context, climate and material truth.",
    paragraph1:
      "Zero Studio Architectures is an architecture practice based in Calicut, Kerala. Founded in 2013 by Hafeez & Arjun, the studio explores architecture that belongs quietly to its geography, climate, and culture.",
    paragraph2:
      "Our work spans residences, hospitality, offices, and cultural spaces across South India, guided by careful spatial planning, honest material palettes, and passive environmental responsiveness.",
    leadArchitects: "Hafeez & Arjun",
  };
}

export async function updateAboutContent(updates: Partial<AboutContent>): Promise<AboutContent> {
  const db = await getDb();
  await db.collection("about").updateOne(
    {},
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getAboutContent();
}
