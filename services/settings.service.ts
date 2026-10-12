import { getDb } from "@/lib/mongodb";
import { SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const doc = await db.collection("siteSettings").findOne({});
  if (doc) {
    return {
      siteTitle: doc.siteTitle,
      siteDescription: doc.siteDescription,
      logoUrl: doc.logoUrl,
      faviconUrl: doc.faviconUrl,
      defaultOgImage: doc.defaultOgImage,
      instagramUrl: doc.instagramUrl,
      facebookUrl: doc.facebookUrl,
    };
  }

  return {
    siteTitle: "Zero Studio Architectures",
    siteDescription: "Architecture studio based in Calicut, Kerala. Rooted in context, climate and material truth.",
    logoUrl: "/ZERO-LOGO.png",
    defaultOgImage: "/ZERO-LOGO-ORIGINAL.png",
    instagramUrl: "https://www.instagram.com/zerostudioofficial",
    facebookUrl: "https://www.facebook.com/zerostudioofficial/",
  };
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await getDb();
  await db.collection("siteSettings").updateOne(
    {},
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getSiteSettings();
}
