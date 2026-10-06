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

async function seed() {
  console.log("==========================================");
  console.log("🌱 Zero Studio Architects — Database Seed");
  console.log("==========================================");
  console.log(`Target MongoDB URI: ${process.env.MONGODB_URI || "mongodb://localhost:27017"}`);
  console.log(`Target Database:    ${process.env.MONGODB_DB || "zero_studio_test"}\n`);

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

  console.log("✅ Seed completed successfully!");
  console.log(`- Hero items:        ${heroCount}`);
  console.log(`- Projects:          ${projectsCount}`);
  console.log(`- About content:     Created/Verified`);
  console.log(`- Awards:            ${awardsCount}`);
  console.log(`- Journal articles:  ${journalCount}`);
  console.log(`- Team members:      ${teamCount}`);
  console.log(`- Contact details:   Created/Verified`);
  console.log(`- Site settings:     Created/Verified`);
  console.log(`- Admin account:     Created/Verified`);
  console.log("\nZero Studio database is ready for production and CMS usage.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
