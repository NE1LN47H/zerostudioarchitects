import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { seedDatabase } from "../lib/db/service";

async function main() {
  console.log("==========================================");
  console.log("🌱 Zero Studio Architects — Database Seed");
  console.log("==========================================");
  console.log(`Target MongoDB URI: ${process.env.MONGODB_URI || "mongodb://localhost:27017"}`);
  console.log(`Target Database:    ${process.env.MONGODB_DB || "zero_studio_test"}\n`);

  try {
    const result = await seedDatabase();
    console.log("✅ Seed completed successfully!");
    console.log(`- Hero items seeded:     ${result.heroCount}`);
    console.log(`- Projects seeded:       ${result.projectsCount}`);
    console.log(`- About content:         ${result.aboutCreated ? "Created/Verified" : "Skipped"}`);
    console.log(`- Awards seeded:         ${result.awardsCount}`);
    console.log(`- Journal articles:      ${result.journalCount}`);
    console.log(`- Team members seeded:   ${result.teamCount}`);
    console.log(`- Contact details:       ${result.contactCreated ? "Created/Verified" : "Skipped"}`);
    console.log(`- Site settings:         ${result.settingsCreated ? "Created/Verified" : "Skipped"}`);
    console.log(`- Admin account:         ${result.adminCreated ? "Created/Verified" : "Skipped"}`);
    console.log("\nZero Studio database is ready for production and CMS usage.");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seed failed or MongoDB could not be reached:", err.message);
    console.log("\nNote: When MongoDB credentials are provided in .env.local, run 'npm run seed' again.");
    process.exit(1);
  }
}

main();
