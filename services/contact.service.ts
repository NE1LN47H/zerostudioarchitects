import { getDb } from "@/lib/mongodb";
import { ContactInfo } from "@/types";

export async function getContactInfo(): Promise<ContactInfo> {
  const db = await getDb();
  const doc = await db.collection("contact").findOne({});
  if (doc) {
    return {
      heading: doc.heading,
      lead: doc.lead,
      emailGeneral: doc.emailGeneral,
      emailJobs: doc.emailJobs,
      phone: doc.phone,
      address: doc.address,
      mapLink: doc.mapLink,
      instagramUrl: doc.instagramUrl,
      facebookUrl: doc.facebookUrl,
    };
  }

  return {
    heading: "Start a project with us.",
    lead: "We take on a limited number of projects each year to give each the time and care it needs.",
    emailGeneral: "mail@zerostudio.org",
    emailJobs: "jobs@zerostudio.org",
    phone: "+91 808 678 0008",
    address: "Zero Studio Architectures\nEranhippalam P.O, Nadakkave\nKozhikode, Kerala 673006\nIndia",
    mapLink: "https://maps.google.com/?q=Zero+Studio+Architectures+Calicut",
    instagramUrl: "https://www.instagram.com/zerostudioofficial",
    facebookUrl: "https://www.facebook.com/zerostudioofficial/",
  };
}

export async function updateContactInfo(updates: Partial<ContactInfo>): Promise<ContactInfo> {
  const db = await getDb();
  await db.collection("contact").updateOne(
    {},
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getContactInfo();
}
