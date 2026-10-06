import { getDb } from "../mongodb";
import {
  HeroItem,
  Project,
  AboutContent,
  AwardItem,
  JournalArticle,
  TeamMember,
  ContactInfo,
  SiteSettings,
  MediaItem,
  AdminUser,
} from "../types";

// ================= HERO (MONGODB SINGLE SOURCE OF TRUTH) =================
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
    id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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

// ================= PROJECTS (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getProjects(onlyVisible = false): Promise<Project[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("projects").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || "",
    editorialIntro: doc.editorialIntro,
    category: doc.category,
    year: doc.year,
    location: doc.location || "",
    area: doc.area || "",
    client: doc.client,
    leadArchitects: doc.leadArchitects,
    photography: doc.photography || "",
    awards: doc.awards || [],
    heroImage: doc.heroImage,
    heroImagePublicId: doc.heroImagePublicId,
    summary: doc.summary || "",
    narrative: doc.narrative || [],
    gallery: doc.gallery || [],
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  const doc = await db.collection("projects").findOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });

  if (!doc) return null;

  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || "",
    editorialIntro: doc.editorialIntro,
    category: doc.category,
    year: doc.year,
    location: doc.location || "",
    area: doc.area || "",
    client: doc.client,
    leadArchitects: doc.leadArchitects,
    photography: doc.photography || "",
    awards: doc.awards || [],
    heroImage: doc.heroImage,
    heroImagePublicId: doc.heroImagePublicId,
    summary: doc.summary || "",
    narrative: doc.narrative || [],
    gallery: doc.gallery || [],
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  };
}

export async function createProject(data: Project): Promise<Project> {
  const db = await getDb();
  const item: Project = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection("projects").insertOne(item);
  return item;
}

export async function updateProject(slug: string, updates: Partial<Project>): Promise<Project | null> {
  const db = await getDb();
  await db.collection("projects").updateOne(
    { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
    { $set: { ...updates, updatedAt: new Date().toISOString() } }
  );
  return await getProjectBySlug(updates.slug || slug);
}

export async function deleteProject(slug: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("projects").deleteOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  });
  return res.deletedCount > 0;
}

export async function reorderProjects(orderedSlugs: string[]): Promise<boolean> {
  const db = await getDb();
  const bulk = db.collection("projects").initializeUnorderedBulkOp();
  orderedSlugs.forEach((slug, index) => {
    bulk.find({ slug }).updateOne({ $set: { order: index + 1 } });
  });
  await bulk.execute();
  return true;
}

// ================= ABOUT (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getAboutContent(): Promise<AboutContent> {
  const db = await getDb();
  const doc = await db.collection("about").findOne({});
  if (!doc) {
    throw new Error("About content document not found in MongoDB.");
  }

  return {
    heading: doc.heading,
    paragraph1: doc.paragraph1,
    paragraph2: doc.paragraph2,
    leadArchitects: doc.leadArchitects,
    stats: doc.stats,
  };
}

export async function updateAboutContent(data: Partial<AboutContent>): Promise<AboutContent> {
  const db = await getDb();
  await db.collection("about").updateOne(
    {},
    { $set: { ...data, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getAboutContent();
}

// ================= AWARDS (MONGODB SINGLE SOURCE OF TRUTH) =================
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
    type: doc.type || "curated",
  }));
}

export async function getCuratedAwards(limit = 4): Promise<AwardItem[]> {
  const db = await getDb();
  const items = await db
    .collection("awards")
    .find({ visible: true, curated: true })
    .sort({ order: 1 })
    .limit(limit)
    .toArray();

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
    curated: doc.curated ?? true,
    visible: doc.visible ?? true,
    type: doc.type || "curated",
  }));
}

export async function createAward(data: Omit<AwardItem, "id">): Promise<AwardItem> {
  const db = await getDb();
  const item: AwardItem = {
    ...data,
    id: `award-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("awards").insertOne(item);
  return item;
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
    type: updated.type || "curated",
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

// ================= JOURNAL (MONGODB SINGLE SOURCE OF TRUTH) =================
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
    content: doc.content,
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
    content: doc.content,
    featured: doc.featured ?? false,
    visible: doc.visible ?? true,
    order: doc.order ?? 1,
  };
}

export async function createJournalArticle(data: JournalArticle): Promise<JournalArticle> {
  const db = await getDb();
  const item: JournalArticle = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection("journal").insertOne(item);
  return item;
}

export async function updateJournalArticle(slug: string, updates: Partial<JournalArticle>): Promise<JournalArticle | null> {
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

// ================= TEAM (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getTeamMembers(onlyVisible = false): Promise<TeamMember[]> {
  const db = await getDb();
  const query = onlyVisible ? { visible: true } : {};
  const items = await db.collection("team").find(query).sort({ order: 1 }).toArray();

  return items.map((doc: any) => ({
    id: doc.id || doc._id?.toString(),
    name: doc.name,
    role: doc.role,
    image: doc.image,
    imagePublicId: doc.imagePublicId,
    bio: doc.bio,
    order: doc.order ?? 1,
    visible: doc.visible ?? true,
  }));
}

export async function createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember> {
  const db = await getDb();
  const item: TeamMember = {
    ...data,
    id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("team").insertOne(item);
  return item;
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

// ================= CONTACT (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getContactInfo(): Promise<ContactInfo> {
  const db = await getDb();
  const doc = await db.collection("contact").findOne({});
  if (!doc) {
    throw new Error("Contact information document not found in MongoDB.");
  }

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

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
  const db = await getDb();
  await db.collection("contact").updateOne(
    {},
    { $set: { ...data, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getContactInfo();
}

// ================= SITE SETTINGS (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const doc = await db.collection("siteSettings").findOne({});
  if (!doc) {
    throw new Error("Site settings document not found in MongoDB.");
  }

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

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await getDb();
  await db.collection("siteSettings").updateOne(
    {},
    { $set: { ...data, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return await getSiteSettings();
}

// ================= MEDIA (MONGODB SINGLE SOURCE OF TRUTH) =================
export async function getMediaItems(): Promise<MediaItem[]> {
  const db = await getDb();
  const items = await db.collection("media").find({}).sort({ createdAt: -1 }).toArray();

  return items.map((doc: any) => ({
    id: doc.id || doc._id?.toString(),
    url: doc.url,
    publicId: doc.publicId,
    filename: doc.filename,
    folder: doc.folder,
    format: doc.format,
    sizeBytes: doc.sizeBytes,
    width: doc.width,
    height: doc.height,
    createdAt: doc.createdAt,
  }));
}

export async function createMediaItem(data: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
  const db = await getDb();
  const item: MediaItem = {
    ...data,
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  await db.collection("media").insertOne(item);
  return item;
}

export async function deleteMediaItem(publicId: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection("media").deleteOne({ publicId });
  return res.deletedCount > 0;
}

// ================= ADMIN AUTH (MONGODB SINGLE SOURCE OF TRUTH) =================
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
