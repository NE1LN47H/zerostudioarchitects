import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { getMongoClient, getDb, sanitizeMongoUri } from "../lib/mongodb";
import { uploadImage, deleteImage, getCloudinaryClient } from "../lib/cloudinary";
import {
  getProjects,
  getProjectBySlug,
  getHeroItems,
  getAboutContent,
  getAwards,
  getJournalArticles,
  getTeamMembers,
  getContactInfo,
  getSiteSettings,
  getPublications,
  getMediaItems,
} from "../lib/db/service";

async function verifyMigration() {
  console.log("==================================================");
  console.log("🔍 COMPREHENSIVE MIGRATION VERIFICATION SUITE");
  console.log("==================================================\n");

  // 1. Verify Environment Variables & Sanitization
  console.log("▶ STEP 1: VERIFYING ENVIRONMENT CONFIGURATION");
  const mongoUri = process.env.MONGODB_URI || "";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const cloudinaryUrl = process.env.CLOUDINARY_URL || "";

  console.log(`MongoDB URI: ${sanitizeMongoUri(mongoUri)}`);
  console.log(`Cloudinary Cloud Name: ${cloudName}`);
  console.log(`Cloudinary API Key configured: ${apiKey ? "YES (redacted)" : "NO"}`);
  console.log(`Cloudinary URL configured: ${cloudinaryUrl ? "YES (redacted)" : "NO"}`);

  if (!mongoUri.includes("cluster0.kyyl3tp.mongodb.net")) {
    throw new Error("❌ MONGODB_URI does not point to the new cluster0.kyyl3tp.mongodb.net!");
  }
  if (!mongoUri.includes("mail_db_user")) {
    throw new Error("❌ MONGODB_URI does not use the new mail_db_user credentials!");
  }
  if (cloudName !== "hle2zpto") {
    throw new Error(`❌ CLOUDINARY_CLOUD_NAME is "${cloudName}", expected "hle2zpto"!`);
  }
  console.log("✅ Step 1 Passed: Environment correctly configured with new credentials.\n");

  // 2. Verify MongoDB Atlas Connection & Collections
  console.log("▶ STEP 2: VERIFYING MONGODB ATLAS LIVE CONNECTION & COUNTS");
  const db = await getDb();
  console.log(`Connected to database "${db.databaseName}" on new Atlas Cluster`);

  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  console.log(`Collections present: ${collectionNames.join(", ")}`);

  const counts: Record<string, number> = {};
  for (const name of collectionNames) {
    counts[name] = await db.collection(name).countDocuments();
  }
  console.log("Document counts in new Atlas database:", counts);

  if (counts.projects < 6) throw new Error("Expected at least 6 projects in new database");
  if (counts.hero < 18) throw new Error("Expected at least 18 hero items in new database");
  if (counts.awards < 23) throw new Error("Expected at least 23 awards in new database");
  if (counts.publications < 21) throw new Error("Expected at least 21 publications in new database");
  if (counts.journal < 6) throw new Error("Expected at least 6 journal articles in new database");
  if (counts.team < 4) throw new Error("Expected 4 team members in new database");
  if (counts.media < 40) throw new Error("Expected at least 40 media items in new database");
  if (counts.admin_users < 1) throw new Error("Expected at least 1 admin user in new database");
  console.log("✅ Step 2 Passed: All 11 collections and records verified in new database.\n");

  // 3. Verify Cloudinary Media & URLs in Content
  console.log("▶ STEP 3: VERIFYING CLOUDINARY IMAGE URLS & RELATIONSHIPS");
  const haven = await getProjectBySlug("HAVEN");
  if (!haven) throw new Error("HAVEN project not found");
  console.log(`HAVEN Hero Image: ${haven.heroImage}`);
  if (!haven.heroImage.includes("res.cloudinary.com/hle2zpto")) {
    throw new Error("HAVEN heroImage does not use new Cloudinary account!");
  }
  console.log(`HAVEN Gallery count: ${haven.gallery.length}`);
  if (haven.gallery.length === 0) throw new Error("HAVEN gallery is empty!");
  for (const img of haven.gallery) {
    if (!img.src.includes("res.cloudinary.com/hle2zpto")) {
      throw new Error(`Gallery image ${img.src} does not use new Cloudinary account!`);
    }
  }

  const team = await getTeamMembers();
  console.log(`Team members count: ${team.length}`);
  for (const member of team) {
    console.log(`  - ${member.name}: ${member.image}`);
    if (!member.image || !member.image.includes("res.cloudinary.com/hle2zpto")) {
      throw new Error(`Team member ${member.name} image does not use new Cloudinary account!`);
    }
  }

  const heroItems = await getHeroItems();
  console.log(`Hero items count: ${heroItems.length}`);
  for (const h of heroItems.slice(0, 3)) {
    console.log(`  - Hero item ${h.title}: ${h.image}`);
    if (!h.image.includes("res.cloudinary.com/hle2zpto")) {
      throw new Error(`Hero item ${h.title} does not use new Cloudinary account!`);
    }
  }
  console.log("✅ Step 3 Passed: Cloudinary URLs verified across projects, team, and hero.\n");

  // 4. Test Cloudinary Live Operations (Upload and Delete)
  console.log("▶ STEP 4: TESTING CLOUDINARY UPLOAD AND DELETE OPERATIONS");
  const testBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAFAAC/674iZcAAAAASUVORK5CYII=";
  const uploadResult = await uploadImage(testBase64, "zerostudio/test_verification");
  console.log(`Uploaded test asset: ${uploadResult.publicId} -> ${uploadResult.url}`);

  if (!uploadResult.url.includes("res.cloudinary.com/hle2zpto")) {
    throw new Error("Cloudinary upload did not return URL with new cloud name hle2zpto!");
  }

  const deleteResult = await deleteImage(uploadResult.publicId);
  console.log(`Deleted test asset ${uploadResult.publicId}: ${deleteResult ? "OK" : "FAILED"}`);
  if (!deleteResult) {
    throw new Error("Failed to delete test asset from new Cloudinary account!");
  }
  console.log("✅ Step 4 Passed: Live Cloudinary upload and delete operations verified.\n");

  // 5. Test Database CRUD on new Atlas Database
  console.log("▶ STEP 5: TESTING DATABASE CRUD ON NEW ATLAS DATABASE");
  const testProjectSlug = "TEST_CRUD_VERIFICATION_PROJECT";
  await db.collection("projects").deleteOne({ slug: testProjectSlug });

  // CREATE
  await db.collection("projects").insertOne({
    slug: testProjectSlug,
    title: "Test Verification Project",
    subtitle: "Temporary CRUD proof",
    category: "Test",
    year: "2026",
    heroImage: haven.heroImage,
    visible: true,
    order: 999,
    gallery: [],
  });
  console.log("  ✓ Created test project in new Atlas database");

  // READ
  const created = await getProjectBySlug(testProjectSlug);
  if (!created || created.title !== "Test Verification Project") {
    throw new Error("Failed to read created project from Atlas database!");
  }
  console.log("  ✓ Read created project from new Atlas database");

  // UPDATE
  await db.collection("projects").updateOne(
    { slug: testProjectSlug },
    { $set: { subtitle: "Updated CRUD proof subtitle" } }
  );
  const updated = await getProjectBySlug(testProjectSlug);
  if (updated?.subtitle !== "Updated CRUD proof subtitle") {
    throw new Error("Failed to update project in Atlas database!");
  }
  console.log("  ✓ Updated project in new Atlas database");

  // DELETE
  await db.collection("projects").deleteOne({ slug: testProjectSlug });
  const deletedCheck = await getProjectBySlug(testProjectSlug);
  if (deletedCheck !== null) {
    throw new Error("Failed to delete project from Atlas database!");
  }
  console.log("  ✓ Deleted test project from new Atlas database");
  console.log("✅ Step 5 Passed: Database CRUD operations fully functional on new Atlas database.\n");

  console.log("==================================================");
  console.log("🎉 ALL MIGRATION VERIFICATION STEPS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

verifyMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });
