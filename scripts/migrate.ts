import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import bcrypt from "bcryptjs";
import { getDb, ensureDatabaseIndexes } from "../lib/mongodb";
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

export interface MigrationSummary {
  heroCount: number;
  projectsCount: number;
  aboutCount: number;
  awardsCount: number;
  journalCount: number;
  teamCount: number;
  contactCount: number;
  settingsCount: number;
  adminCount: number;
}

export async function runMigration(): Promise<MigrationSummary> {
  console.log("==================================================");
  console.log("🚀 Zero Studio Architects — Content Migration");
  console.log("==================================================");

  // Safely display target info without logging credentials
  const db = await getDb();
  console.log(`Connected to database: "${db.databaseName}"`);
  console.log("Ensuring indexes on collections...");
  await ensureDatabaseIndexes(db);

  // 1. Hero items (Upsert by stable id)
  let heroCount = 0;
  for (const item of INITIAL_HERO_ITEMS) {
    await db.collection("hero").updateOne(
      { id: item.id },
      { $set: item },
      { upsert: true }
    );
    heroCount++;
  }

  // 2. Projects (Upsert by unique slug, preserving order, gallery, and details)
  let projectsCount = 0;
  for (const project of INITIAL_PROJECTS) {
    await db.collection("projects").updateOne(
      { slug: project.slug },
      { $set: project },
      { upsert: true }
    );
    projectsCount++;
  }

  // 3. About
  await db.collection("about").updateOne(
    {},
    { $set: INITIAL_ABOUT },
    { upsert: true }
  );
  const aboutCount = 1;

  // 4. Awards (Upsert by stable id)
  let awardsCount = 0;
  for (const award of INITIAL_AWARDS) {
    await db.collection("awards").updateOne(
      { id: award.id },
      { $set: award },
      { upsert: true }
    );
    awardsCount++;
  }

  // 5. Journal (Upsert by unique slug)
  let journalCount = 0;
  for (const article of INITIAL_JOURNAL) {
    await db.collection("journal").updateOne(
      { slug: article.slug },
      { $set: article },
      { upsert: true }
    );
    journalCount++;
  }

  // 6. Team (Upsert by stable id)
  let teamCount = 0;
  for (const member of INITIAL_TEAM) {
    await db.collection("team").updateOne(
      { id: member.id },
      { $set: member },
      { upsert: true }
    );
    teamCount++;
  }

  // 7. Contact
  await db.collection("contact").updateOne(
    {},
    { $set: INITIAL_CONTACT },
    { upsert: true }
  );
  const contactCount = 1;

  // 8. Site Settings
  await db.collection("siteSettings").updateOne(
    {},
    { $set: INITIAL_SETTINGS },
    { upsert: true }
  );
  const settingsCount = 1;

  // 9. Admin User (Preserve existing if set)
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
  const adminCount = 1;

  console.log("\n==================================================");
  console.log("📊 MIGRATION REPORT");
  console.log("==================================================");
  console.log(`Projects migrated:        ${projectsCount}`);
  console.log(`Hero items migrated:      ${heroCount}`);
  console.log(`Awards migrated:          ${awardsCount}`);
  console.log(`Journal articles migrated: ${journalCount}`);
  console.log(`Team members migrated:    ${teamCount}`);
  console.log(`About content migrated:   ${aboutCount}`);
  console.log(`Contact details migrated: ${contactCount}`);
  console.log(`Site settings migrated:   ${settingsCount}`);
  console.log(`Admin user verified:      ${adminCount}`);
  console.log("==================================================");

  return {
    heroCount,
    projectsCount,
    aboutCount,
    awardsCount,
    journalCount,
    teamCount,
    contactCount,
    settingsCount,
    adminCount,
  };
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log("✨ Migration finished successfully without errors.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Migration failed:", err.message);
      process.exit(1);
    });
}
