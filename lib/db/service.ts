import { getDb, ensureDatabaseIndexes } from "../mongodb";
import {
  INITIAL_HERO_ITEMS,
  INITIAL_PROJECTS,
  INITIAL_ABOUT,
  INITIAL_AWARDS,
  INITIAL_JOURNAL,
  INITIAL_TEAM,
  INITIAL_CONTACT,
  INITIAL_SETTINGS,
} from "./initialData";
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
import bcrypt from "bcryptjs";

// In-memory runtime cache as safety fallback if MongoDB is temporarily connecting or unreachable
const memoryStore = {
  hero: [...INITIAL_HERO_ITEMS],
  projects: [...INITIAL_PROJECTS],
  about: { ...INITIAL_ABOUT },
  awards: [...INITIAL_AWARDS],
  journal: [...INITIAL_JOURNAL],
  team: [...INITIAL_TEAM],
  contact: { ...INITIAL_CONTACT },
  settings: { ...INITIAL_SETTINGS },
  media: [] as MediaItem[],
};

async function withDb<T>(
  action: (db: any) => Promise<T>,
  fallback: () => T | Promise<T>
): Promise<T> {
  try {
    const db = await getDb();
    return await action(db);
  } catch (err: any) {
    // If MongoDB is not reachable (e.g. test credentials or server down), gracefully fall back
    return fallback();
  }
}

// ================= HERO =================
export async function getHeroItems(onlyVisible = false): Promise<HeroItem[]> {
  return withDb(
    async (db) => {
      const query = onlyVisible ? { visible: true } : {};
      const items = await db.collection("hero").find(query).sort({ order: 1 }).toArray();
      if (items.length === 0) return memoryStore.hero;
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
    },
    () => (onlyVisible ? memoryStore.hero.filter((h) => h.visible) : memoryStore.hero)
  );
}

export async function createHeroItem(data: Omit<HeroItem, "id">): Promise<HeroItem> {
  const newItem: HeroItem = {
    ...data,
    id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    meta: data.meta || `${data.category} · ${data.year}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.hero.push(newItem);

  return withDb(
    async (db) => {
      await db.collection("hero").insertOne(newItem);
      return newItem;
    },
    () => newItem
  );
}

export async function updateHeroItem(id: string, updates: Partial<HeroItem>): Promise<HeroItem | null> {
  const index = memoryStore.hero.findIndex((h) => h.id === id);
  if (index !== -1) {
    memoryStore.hero[index] = {
      ...memoryStore.hero[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return withDb(
    async (db) => {
      await db.collection("hero").updateOne(
        { $or: [{ id }, { _id: id as any }] },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      const updated = await db.collection("hero").findOne({ $or: [{ id }, { _id: id as any }] });
      return updated;
    },
    () => (index !== -1 ? memoryStore.hero[index] : null)
  );
}

export async function deleteHeroItem(id: string): Promise<boolean> {
  const idx = memoryStore.hero.findIndex((h) => h.id === id);
  if (idx !== -1) memoryStore.hero.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("hero").deleteOne({ $or: [{ id }, { _id: id as any }] });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

export async function reorderHeroItems(orderedIds: string[]): Promise<boolean> {
  orderedIds.forEach((id, index) => {
    const item = memoryStore.hero.find((h) => h.id === id);
    if (item) item.order = index + 1;
  });
  memoryStore.hero.sort((a, b) => a.order - b.order);

  return withDb(
    async (db) => {
      const bulk = db.collection("hero").initializeUnorderedBulkOp();
      orderedIds.forEach((id, index) => {
        bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
      });
      await bulk.execute();
      return true;
    },
    () => true
  );
}

// ================= PROJECTS =================
export async function getProjects(onlyVisible = false): Promise<Project[]> {
  return withDb(
    async (db) => {
      const query = onlyVisible ? { visible: true } : {};
      const items = await db.collection("projects").find(query).sort({ order: 1 }).toArray();
      if (items.length === 0) return memoryStore.projects;
      return items.map((doc: any) => ({
        slug: doc.slug,
        title: doc.title,
        subtitle: doc.subtitle || "",
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
    },
    () => (onlyVisible ? memoryStore.projects.filter((p) => p.visible) : memoryStore.projects)
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const norm = slug.toLowerCase();
  return withDb(
    async (db) => {
      const item = await db.collection("projects").findOne({
        slug: { $regex: new RegExp(`^${slug}$`, "i") },
      });
      if (!item) {
        return memoryStore.projects.find((p) => p.slug.toLowerCase() === norm) || null;
      }
      return item;
    },
    () => memoryStore.projects.find((p) => p.slug.toLowerCase() === norm) || null
  );
}

export async function createProject(data: Project): Promise<Project> {
  const item: Project = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.projects.push(item);

  return withDb(
    async (db) => {
      await db.collection("projects").insertOne(item);
      return item;
    },
    () => item
  );
}

export async function updateProject(slug: string, updates: Partial<Project>): Promise<Project | null> {
  const idx = memoryStore.projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (idx !== -1) {
    memoryStore.projects[idx] = {
      ...memoryStore.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return withDb(
    async (db) => {
      await db.collection("projects").updateOne(
        { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      return await getProjectBySlug(updates.slug || slug);
    },
    () => (idx !== -1 ? memoryStore.projects[idx] : null)
  );
}

export async function deleteProject(slug: string): Promise<boolean> {
  const idx = memoryStore.projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (idx !== -1) memoryStore.projects.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("projects").deleteOne({
        slug: { $regex: new RegExp(`^${slug}$`, "i") },
      });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

export async function reorderProjects(orderedSlugs: string[]): Promise<boolean> {
  orderedSlugs.forEach((slug, index) => {
    const item = memoryStore.projects.find((p) => p.slug === slug);
    if (item) item.order = index + 1;
  });
  memoryStore.projects.sort((a, b) => a.order - b.order);

  return withDb(
    async (db) => {
      const bulk = db.collection("projects").initializeUnorderedBulkOp();
      orderedSlugs.forEach((slug, index) => {
        bulk.find({ slug }).updateOne({ $set: { order: index + 1 } });
      });
      await bulk.execute();
      return true;
    },
    () => true
  );
}

// ================= ABOUT =================
export async function getAboutContent(): Promise<AboutContent> {
  return withDb(
    async (db) => {
      const about = await db.collection("about").findOne({});
      if (!about) return memoryStore.about;
      return {
        heading: about.heading || memoryStore.about.heading,
        paragraph1: about.paragraph1 || memoryStore.about.paragraph1,
        paragraph2: about.paragraph2 || memoryStore.about.paragraph2,
        leadArchitects: about.leadArchitects,
        stats: about.stats,
      };
    },
    () => memoryStore.about
  );
}

export async function updateAboutContent(data: Partial<AboutContent>): Promise<AboutContent> {
  memoryStore.about = {
    ...memoryStore.about,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return withDb(
    async (db) => {
      await db.collection("about").updateOne(
        {},
        { $set: { ...data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return await getAboutContent();
    },
    () => memoryStore.about
  );
}

// ================= AWARDS =================
export async function getAwards(onlyVisible = false): Promise<AwardItem[]> {
  return withDb(
    async (db) => {
      const query = onlyVisible ? { visible: true } : {};
      const items = await db.collection("awards").find(query).sort({ order: 1 }).toArray();
      if (items.length === 0) return memoryStore.awards;
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
    },
    () => (onlyVisible ? memoryStore.awards.filter((a) => a.visible) : memoryStore.awards)
  );
}

export async function createAward(data: Omit<AwardItem, "id">): Promise<AwardItem> {
  const item: AwardItem = {
    ...data,
    id: `award-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    updatedAt: new Date().toISOString(),
  };

  memoryStore.awards.push(item);

  return withDb(
    async (db) => {
      await db.collection("awards").insertOne(item);
      return item;
    },
    () => item
  );
}

export async function updateAward(id: string, updates: Partial<AwardItem>): Promise<AwardItem | null> {
  const idx = memoryStore.awards.findIndex((a) => a.id === id);
  if (idx !== -1) {
    memoryStore.awards[idx] = {
      ...memoryStore.awards[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return withDb(
    async (db) => {
      await db.collection("awards").updateOne(
        { $or: [{ id }, { _id: id as any }] },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      const updated = await db.collection("awards").findOne({ $or: [{ id }, { _id: id as any }] });
      return updated;
    },
    () => (idx !== -1 ? memoryStore.awards[idx] : null)
  );
}

export async function deleteAward(id: string): Promise<boolean> {
  const idx = memoryStore.awards.findIndex((a) => a.id === id);
  if (idx !== -1) memoryStore.awards.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("awards").deleteOne({ $or: [{ id }, { _id: id as any }] });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

export async function reorderAwards(orderedIds: string[]): Promise<boolean> {
  orderedIds.forEach((id, index) => {
    const item = memoryStore.awards.find((a) => a.id === id);
    if (item) item.order = index + 1;
  });
  memoryStore.awards.sort((a, b) => a.order - b.order);

  return withDb(
    async (db) => {
      const bulk = db.collection("awards").initializeUnorderedBulkOp();
      orderedIds.forEach((id, index) => {
        bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
      });
      await bulk.execute();
      return true;
    },
    () => true
  );
}

// ================= JOURNAL =================
export async function getJournalArticles(onlyVisible = false): Promise<JournalArticle[]> {
  return withDb(
    async (db) => {
      const query = onlyVisible ? { visible: true } : {};
      const items = await db.collection("journal").find(query).sort({ order: 1 }).toArray();
      if (items.length === 0) return memoryStore.journal;
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
    },
    () => (onlyVisible ? memoryStore.journal.filter((j) => j.visible) : memoryStore.journal)
  );
}

export async function getArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const norm = slug.toLowerCase();
  return withDb(
    async (db) => {
      const item = await db.collection("journal").findOne({
        slug: { $regex: new RegExp(`^${slug}$`, "i") },
      });
      if (!item) {
        return memoryStore.journal.find((a) => a.slug.toLowerCase() === norm) || null;
      }
      return item;
    },
    () => memoryStore.journal.find((a) => a.slug.toLowerCase() === norm) || null
  );
}

export async function createJournalArticle(data: JournalArticle): Promise<JournalArticle> {
  const item: JournalArticle = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.journal.push(item);

  return withDb(
    async (db) => {
      await db.collection("journal").insertOne(item);
      return item;
    },
    () => item
  );
}

export async function updateJournalArticle(slug: string, updates: Partial<JournalArticle>): Promise<JournalArticle | null> {
  const idx = memoryStore.journal.findIndex((a) => a.slug.toLowerCase() === slug.toLowerCase());
  if (idx !== -1) {
    memoryStore.journal[idx] = {
      ...memoryStore.journal[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return withDb(
    async (db) => {
      await db.collection("journal").updateOne(
        { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      return await getArticleBySlug(updates.slug || slug);
    },
    () => (idx !== -1 ? memoryStore.journal[idx] : null)
  );
}

export async function deleteJournalArticle(slug: string): Promise<boolean> {
  const idx = memoryStore.journal.findIndex((a) => a.slug.toLowerCase() === slug.toLowerCase());
  if (idx !== -1) memoryStore.journal.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("journal").deleteOne({
        slug: { $regex: new RegExp(`^${slug}$`, "i") },
      });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

export async function reorderJournalArticles(orderedSlugs: string[]): Promise<boolean> {
  orderedSlugs.forEach((slug, index) => {
    const item = memoryStore.journal.find((j) => j.slug === slug);
    if (item) item.order = index + 1;
  });
  memoryStore.journal.sort((a, b) => a.order - b.order);

  return withDb(
    async (db) => {
      const bulk = db.collection("journal").initializeUnorderedBulkOp();
      orderedSlugs.forEach((slug, index) => {
        bulk.find({ slug }).updateOne({ $set: { order: index + 1 } });
      });
      await bulk.execute();
      return true;
    },
    () => true
  );
}

// ================= TEAM =================
export async function getTeamMembers(onlyVisible = false): Promise<TeamMember[]> {
  return withDb(
    async (db) => {
      const query = onlyVisible ? { visible: true } : {};
      const items = await db.collection("team").find(query).sort({ order: 1 }).toArray();
      if (items.length === 0) return memoryStore.team;
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
    },
    () => (onlyVisible ? memoryStore.team.filter((t) => t.visible) : memoryStore.team)
  );
}

export async function createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember> {
  const item: TeamMember = {
    ...data,
    id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    updatedAt: new Date().toISOString(),
  };

  memoryStore.team.push(item);

  return withDb(
    async (db) => {
      await db.collection("team").insertOne(item);
      return item;
    },
    () => item
  );
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const idx = memoryStore.team.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryStore.team[idx] = {
      ...memoryStore.team[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return withDb(
    async (db) => {
      await db.collection("team").updateOne(
        { $or: [{ id }, { _id: id as any }] },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      const updated = await db.collection("team").findOne({ $or: [{ id }, { _id: id as any }] });
      return updated;
    },
    () => (idx !== -1 ? memoryStore.team[idx] : null)
  );
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const idx = memoryStore.team.findIndex((t) => t.id === id);
  if (idx !== -1) memoryStore.team.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("team").deleteOne({ $or: [{ id }, { _id: id as any }] });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

export async function reorderTeamMembers(orderedIds: string[]): Promise<boolean> {
  orderedIds.forEach((id, index) => {
    const item = memoryStore.team.find((t) => t.id === id);
    if (item) item.order = index + 1;
  });
  memoryStore.team.sort((a, b) => a.order - b.order);

  return withDb(
    async (db) => {
      const bulk = db.collection("team").initializeUnorderedBulkOp();
      orderedIds.forEach((id, index) => {
        bulk.find({ $or: [{ id }, { _id: id as any }] }).updateOne({ $set: { order: index + 1 } });
      });
      await bulk.execute();
      return true;
    },
    () => true
  );
}

// ================= CONTACT =================
export async function getContactInfo(): Promise<ContactInfo> {
  return withDb(
    async (db) => {
      const contact = await db.collection("contact").findOne({});
      if (!contact) return memoryStore.contact;
      return {
        heading: contact.heading || memoryStore.contact.heading,
        lead: contact.lead || memoryStore.contact.lead,
        emailGeneral: contact.emailGeneral || memoryStore.contact.emailGeneral,
        emailJobs: contact.emailJobs || memoryStore.contact.emailJobs,
        phone: contact.phone || memoryStore.contact.phone,
        address: contact.address || memoryStore.contact.address,
        mapLink: contact.mapLink || memoryStore.contact.mapLink,
        instagramUrl: contact.instagramUrl || memoryStore.contact.instagramUrl,
        facebookUrl: contact.facebookUrl || memoryStore.contact.facebookUrl,
      };
    },
    () => memoryStore.contact
  );
}

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
  memoryStore.contact = {
    ...memoryStore.contact,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return withDb(
    async (db) => {
      await db.collection("contact").updateOne(
        {},
        { $set: { ...data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return await getContactInfo();
    },
    () => memoryStore.contact
  );
}

// ================= SITE SETTINGS =================
export async function getSiteSettings(): Promise<SiteSettings> {
  return withDb(
    async (db) => {
      const settings = await db.collection("siteSettings").findOne({});
      if (!settings) return memoryStore.settings;
      return {
        siteTitle: settings.siteTitle || memoryStore.settings.siteTitle,
        siteDescription: settings.siteDescription || memoryStore.settings.siteDescription,
        logoUrl: settings.logoUrl || memoryStore.settings.logoUrl,
        faviconUrl: settings.faviconUrl || memoryStore.settings.faviconUrl,
        defaultOgImage: settings.defaultOgImage || memoryStore.settings.defaultOgImage,
        instagramUrl: settings.instagramUrl || memoryStore.settings.instagramUrl,
        facebookUrl: settings.facebookUrl || memoryStore.settings.facebookUrl,
      };
    },
    () => memoryStore.settings
  );
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  memoryStore.settings = {
    ...memoryStore.settings,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return withDb(
    async (db) => {
      await db.collection("siteSettings").updateOne(
        {},
        { $set: { ...data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return await getSiteSettings();
    },
    () => memoryStore.settings
  );
}

// ================= MEDIA =================
export async function getMediaItems(): Promise<MediaItem[]> {
  return withDb(
    async (db) => {
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
    },
    () => memoryStore.media
  );
}

export async function createMediaItem(item: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
  const newMedia: MediaItem = {
    ...item,
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  memoryStore.media.unshift(newMedia);

  return withDb(
    async (db) => {
      await db.collection("media").insertOne(newMedia);
      return newMedia;
    },
    () => newMedia
  );
}

export async function deleteMediaItem(publicId: string): Promise<boolean> {
  const idx = memoryStore.media.findIndex((m) => m.publicId === publicId);
  if (idx !== -1) memoryStore.media.splice(idx, 1);

  return withDb(
    async (db) => {
      const res = await db.collection("media").deleteOne({ publicId });
      return res.deletedCount > 0;
    },
    () => idx !== -1
  );
}

// ================= ADMIN USER & SEED =================
export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const defaultEmail = process.env.ADMIN_EMAIL || "admin@zerostudio.org";
  const defaultPass = process.env.ADMIN_PASSWORD || "admin123456";

  return withDb(
    async (db) => {
      const user = await db.collection("admin_users").findOne({ email: email.toLowerCase().trim() });
      if (user) {
        return {
          id: user.id || user._id.toString(),
          email: user.email,
          name: user.name,
          passwordHash: user.passwordHash,
          role: user.role,
          createdAt: user.createdAt,
        };
      }
      if (email.toLowerCase().trim() === defaultEmail.toLowerCase().trim()) {
        const hash = await bcrypt.hash(defaultPass, 10);
        return {
          id: "admin-default",
          email: defaultEmail,
          name: "Studio Administrator",
          passwordHash: hash,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
      }
      return null;
    },
    async () => {
      if (email.toLowerCase().trim() === defaultEmail.toLowerCase().trim()) {
        const hash = await bcrypt.hash(defaultPass, 10);
        return {
          id: "admin-default",
          email: defaultEmail,
          name: "Studio Administrator",
          passwordHash: hash,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
      }
      return null;
    }
  );
}

/**
 * Safe, idempotent seed function that populates MongoDB with actual website content.
 * Prevents duplicates.
 */
export async function seedDatabase(): Promise<{
  heroCount: number;
  projectsCount: number;
  aboutCreated: boolean;
  awardsCount: number;
  journalCount: number;
  teamCount: number;
  contactCreated: boolean;
  settingsCreated: boolean;
  adminCreated: boolean;
}> {
  const db = await getDb();
  await ensureDatabaseIndexes(db);

  // 1. Hero items (idempotent upsert by id)
  let heroCount = 0;
  for (const item of INITIAL_HERO_ITEMS) {
    await db.collection("hero").updateOne(
      { id: item.id },
      { $setOnInsert: item },
      { upsert: true }
    );
    heroCount++;
  }

  // 2. Projects (idempotent upsert by slug)
  let projectsCount = 0;
  for (const project of INITIAL_PROJECTS) {
    await db.collection("projects").updateOne(
      { slug: project.slug },
      { $setOnInsert: project },
      { upsert: true }
    );
    projectsCount++;
  }

  // 3. About
  await db.collection("about").updateOne(
    {},
    { $setOnInsert: INITIAL_ABOUT },
    { upsert: true }
  );

  // 4. Awards
  let awardsCount = 0;
  for (const award of INITIAL_AWARDS) {
    await db.collection("awards").updateOne(
      { id: award.id },
      { $setOnInsert: award },
      { upsert: true }
    );
    awardsCount++;
  }

  // 5. Journal
  let journalCount = 0;
  for (const article of INITIAL_JOURNAL) {
    await db.collection("journal").updateOne(
      { slug: article.slug },
      { $setOnInsert: article },
      { upsert: true }
    );
    journalCount++;
  }

  // 6. Team
  let teamCount = 0;
  for (const member of INITIAL_TEAM) {
    await db.collection("team").updateOne(
      { id: member.id },
      { $setOnInsert: member },
      { upsert: true }
    );
    teamCount++;
  }

  // 7. Contact
  await db.collection("contact").updateOne(
    {},
    { $setOnInsert: INITIAL_CONTACT },
    { upsert: true }
  );

  // 8. Site Settings
  await db.collection("siteSettings").updateOne(
    {},
    { $setOnInsert: INITIAL_SETTINGS },
    { upsert: true }
  );

  // 9. Admin User
  const defaultEmail = process.env.ADMIN_EMAIL || "admin@zerostudio.org";
  const defaultPass = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(defaultPass, 10);

  await db.collection("admin_users").updateOne(
    { email: defaultEmail },
    {
      $setOnInsert: {
        id: "admin-1",
        email: defaultEmail,
        name: "Studio Administrator",
        passwordHash,
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  return {
    heroCount,
    projectsCount,
    aboutCreated: true,
    awardsCount,
    journalCount,
    teamCount,
    contactCreated: true,
    settingsCreated: true,
    adminCreated: true,
  };
}
